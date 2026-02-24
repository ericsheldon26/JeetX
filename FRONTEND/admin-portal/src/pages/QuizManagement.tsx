import React, { useEffect, useState } from 'react';
import {
    HelpCircle,
    PlusCircle,
    Send,
    Loader2,
    List,
    Filter,
    CheckCircle2,
    AlertCircle,
    Trophy,
    X,
    Pencil,
    Power,
    UploadCloud,
} from 'lucide-react';
import { quizApi } from '../api/adminApi';


interface Category {
    id: string;
    name: string;
    description: string;
    icon_url: string | null;
    display_order: number;
    status: string;
    created_at: string;
    updated_at: string;
    total_questions: string;
    practice_configured: boolean;
}

interface Question {
    id: string;
    sub_category_id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
    image_path?: string;
}

interface Stats {
    total_questions: number;
    active_questions: number;
    inactive_questions: number;
    by_difficulty: {
        EASY: number;
        MEDIUM: number;
        HARD: number;
    };
}

const QuizManagement: React.FC = () => {
    // Basic States
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'EDIT'>('LIST');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Stats State
    const [stats, setStats] = useState<Stats | null>(null);

    // List State
    const [questions, setQuestions] = useState<Question[]>([]);
    // const [pagination, setPagination] = useState<Pagination>({ total: 0, offset: 0 });
    // const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        sub_category_id: '', // This map to Category ID in flat structure
        difficulty: '' as any,
        status: '' as any,
    });

    // Detail State
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        sub_category_id: '',
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A' as 'A' | 'B' | 'C' | 'D',
        difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD',
        attachment: null as File | null,
        existing_image_url: null as string | null
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedQuestion) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [selectedQuestion]);

    const fetchInitialData = async () => {
        setLoading(true);
        console.log('🔄 Fetching initial data for Quiz Management...');
        try {
            await Promise.all([
                fetchCategories().catch(e => console.error('Categories failed:', e)),
                fetchStats().catch(e => console.error('Stats failed:', e)),
                fetchQuestions().catch(e => console.error('Questions failed:', e))
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await quizApi.getCategories();
            if (response.data.success) {
                console.log('✅ Categories fetched:', (response.data.data || []).length);
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchStats = async (subCatId?: string) => {
        try {
            const response = await quizApi.getQuestionStats(subCatId);
            if (response.data.success) {
                const data = response.data.data || {};
                // Map the flat API response to our potentially nested Stats structure
                // API: { total: "15", active: "15", inactive: "0", easy: "15", medium: "0", hard: "0" }
                // Stats: { total_questions, active_questions, inactive_questions, by_difficulty: { EASY, MEDIUM, HARD } }
                setStats({
                    total_questions: Number(data.total || 0),
                    active_questions: Number(data.active || 0),
                    inactive_questions: Number(data.inactive || 0),
                    by_difficulty: {
                        EASY: Number(data.easy || 0),
                        MEDIUM: Number(data.medium || 0),
                        HARD: Number(data.hard || 0)
                    }
                });
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries({ ...filters }).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
            );

            const response = await quizApi.listQuestions(cleanFilters as any);
            console.log('📡 API Response:', response.data);

            if (response.data.success) {
                setQuestions(response.data.data || []);
                // if (response.data.pagination) {
                //    setPagination(response.data.pagination);
                // }
            }
        } catch (error: any) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (q: Question) => {
        setEditingId(q.id);
        setFormData({
            sub_category_id: q.sub_category_id,
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_option: q.correct_option as any,
            difficulty: q.difficulty,
            attachment: null,
            existing_image_url: q.image_path || null
        });
        setViewMode('EDIT');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            sub_category_id: '',
            question_text: '',
            option_a: '',
            option_b: '',
            option_c: '',
            option_d: '',
            correct_option: 'A',
            difficulty: 'MEDIUM',
            attachment: null,
            existing_image_url: null
        });
        setViewMode('LIST');
    };

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            const response = await quizApi.updateQuestionStatus(id, newStatus);
            if (response.data.success) {
                // Update local state instead of refetching everything for better UX
                setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
                if (selectedQuestion?.id === id) {
                    setSelectedQuestion({ ...selectedQuestion, status: newStatus });
                }
                // Refresh stats since counts changed
                fetchStats(filters.sub_category_id);
            }
        } catch (error: any) {
            console.error('Status update failed:', error);
            alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let response;
            if (viewMode === 'EDIT' && editingId) {
                response = await quizApi.updateQuestion(editingId, formData);
            } else {
                const payload = {
                    ...formData,
                    attachment: formData.attachment || undefined
                };
                // Remove existing_image_url from payload as createQuestion doesn't expect it
                delete (payload as any).existing_image_url;

                response = await quizApi.createQuestion(payload);
            }

            if (response.data.success) {
                alert(viewMode === 'EDIT' ? 'Question updated successfully!' : 'Question created successfully!');
                setEditingId(null);
                setFormData({
                    sub_category_id: '',
                    question_text: '',
                    option_a: '',
                    option_b: '',
                    option_c: '',
                    option_d: '',
                    correct_option: 'A',
                    difficulty: 'MEDIUM',
                    attachment: null,
                    existing_image_url: null
                });
                fetchQuestions();
                fetchStats(filters.sub_category_id);
                setViewMode('LIST');
            }
        } catch (error: any) {
            console.error('Operation failed:', error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                alert('Please upload a valid CSV file.');
                return;
            }

            setLoading(true);
            try {
                const response = await quizApi.bulkUploadQuestions(file);
                if (response.data.success) {
                    alert(`Bulk upload successful! Processed ${response.data.processed || 0} questions.`);
                    fetchQuestions();
                    fetchStats(filters.sub_category_id);
                }
            } catch (error: any) {
                console.error('Bulk upload failed:', error);
                alert(`Bulk upload failed: ${error.response?.data?.message || error.message}`);
            } finally {
                setLoading(false);
                // Reset file input
                e.target.value = '';
            }
        }
    };

    const applyFilters = () => {
        // setCurrentPage(1);
        fetchQuestions();
        fetchStats(filters.sub_category_id);
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '60vh' }}>
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <>
            <div className="quiz-management-page animate-fadeIn">
                {/* Header */}
                <header className="page-header">
                    <div className="header-info">
                        <h1>{viewMode === 'EDIT' ? 'Edit Question' : 'Quiz Management'}</h1>
                        <p className="subtitle">
                            {viewMode === 'EDIT' ? 'Update the details of the existing question.' : 'Manage questions, view statistics and create new challenges.'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="file"
                                id="bulk-upload"
                                accept=".csv"
                                style={{ display: 'none' }}
                                onChange={handleBulkUpload}
                            />
                            <label
                                htmlFor="bulk-upload"
                                className="btn-secondary"
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', height: '100%' }}
                            >
                                {loading && <Loader2 className="animate-spin" size={16} />}
                                {!loading && <UploadCloud size={16} />}
                                <span>Bulk Upload</span>
                            </label>
                        </div>
                        <button
                            className={viewMode === 'LIST' ? 'btn-primary' : 'btn-secondary'}
                            onClick={() => { setViewMode('LIST'); setEditingId(null); }}
                        >
                            <List size={20} />
                            View List
                        </button>
                        <button
                            className={viewMode === 'CREATE' ? 'btn-primary' : 'btn-secondary'}
                            onClick={() => {
                                setViewMode('CREATE');
                                setEditingId(null);
                                setFormData({
                                    sub_category_id: '',
                                    question_text: '',
                                    option_a: '',
                                    option_b: '',
                                    option_c: '',
                                    option_d: '',
                                    correct_option: 'A',
                                    difficulty: 'MEDIUM',
                                    attachment: null,
                                    existing_image_url: null
                                });
                            }}
                        >
                            <PlusCircle size={20} />
                            Create New
                        </button>
                    </div>
                </header>

                {/* List View */}
                {viewMode === 'LIST' && (
                    <>
                        {/* Stats Dashboard */}
                        {stats && (
                            <div className="stats-grid animate-fadeIn" style={{ marginBottom: '2.5rem' }}>
                                <div className="card stat-card total">
                                    <div className="stat-header">
                                        <HelpCircle size={20} />
                                        <span>Total Questions</span>
                                    </div>
                                    <div className="stat-value">{stats.total_questions}</div>
                                    <div className="stat-sub">
                                        {filters.sub_category_id ?
                                            `In: ${categories.find(s => s.id === filters.sub_category_id)?.name}` :
                                            'Across all categories'}
                                    </div>
                                </div>
                                <div className="card stat-card active">
                                    <div className="stat-header">
                                        <CheckCircle2 size={20} />
                                        <span>Active Questions</span>
                                    </div>
                                    <div className="stat-value">{stats.active_questions}</div>
                                    <div className="stat-percentage" style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                                        {Math.round((stats.active_questions / stats.total_questions) * 100 || 0)}% of total
                                    </div>
                                </div>
                                <div className="card stat-card inactive">
                                    <div className="stat-header">
                                        <AlertCircle size={20} />
                                        <span>Inactive Questions</span>
                                    </div>
                                    <div className="stat-value">{stats.inactive_questions}</div>
                                    <div className="stat-percentage" style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>
                                        {Math.round((stats.inactive_questions / stats.total_questions) * 100 || 0)}% of total
                                    </div>
                                </div>
                                <div className="card stat-card difficulty">
                                    <div className="stat-header">
                                        <Trophy size={20} />
                                        <span>Difficulty Breakdown</span>
                                    </div>
                                    <div className="difficulty-bars">
                                        <div className="diff-bar-item">
                                            <label>Easy</label>
                                            <div className="bar-bg">
                                                <div className="bar-fill easy" style={{ width: `${(stats.by_difficulty?.EASY / stats.total_questions) * 100}%` }}></div>
                                            </div>
                                            <span>{stats.by_difficulty?.EASY ?? 0}</span>
                                        </div>
                                        <div className="diff-bar-item">
                                            <label>Med</label>
                                            <div className="bar-bg">
                                                <div className="bar-fill medium" style={{ width: `${(stats.by_difficulty?.MEDIUM / stats.total_questions) * 100}%` }}></div>
                                            </div>
                                            <span>{stats.by_difficulty?.MEDIUM ?? 0}</span>
                                        </div>
                                        <div className="diff-bar-item">
                                            <label>Hard</label>
                                            <div className="bar-bg">
                                                <div className="bar-fill hard" style={{ width: `${(stats.by_difficulty?.HARD / stats.total_questions) * 100}%` }}></div>
                                            </div>
                                            <span>{stats.by_difficulty?.HARD ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Filter Bar */}
                        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem' }}><Filter size={12} /> Sub Category</label>
                                    <select
                                        value={filters.sub_category_id}
                                        onChange={e => setFilters({ ...filters, sub_category_id: e.target.value })}
                                        style={{ padding: '0.5rem', height: '42px' }}
                                    >
                                        <option value="">All Sub Categories</option>
                                        {categories.length > 0 ? (
                                            categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No categories available</option>
                                        )}
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem' }}>Difficulty</label>
                                    <select
                                        value={filters.difficulty}
                                        onChange={e => setFilters({ ...filters, difficulty: e.target.value })}
                                        style={{ padding: '0.5rem', height: '42px' }}
                                    >
                                        <option value="">All Difficulties</option>
                                        <option value="EASY">EASY</option>
                                        <option value="MEDIUM">MEDIUM</option>
                                        <option value="HARD">HARD</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem' }}>Status</label>
                                    <select
                                        value={filters.status}
                                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                                        style={{ padding: '0.5rem', height: '42px' }}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>
                                <button className="btn-primary" onClick={applyFilters} style={{ height: '42px', marginTop: 0 }}>
                                    <Filter size={18} />
                                    <span>Apply Filters</span>
                                </button>
                            </div>
                        </div>

                        {/* Questions Grid */}
                        <div className="questions-container animate-fadeIn">
                            {questions.length > 0 ? (
                                questions.map(q => (
                                    <div key={q.id} className="question-horizontal-card animate-fadeIn">
                                        <div className="card-top-info" onClick={() => setSelectedQuestion(q)}>
                                            <div className="question-main-content">
                                                <div className="question-header-row">
                                                    <span className={`badge ${q.difficulty.toLowerCase()}`}>
                                                        {q.difficulty}
                                                    </span>
                                                    <div className="status-indicator">
                                                        <span className={`status-dot ${q.status === 'ACTIVE' ? 'active' : 'inactive'}`}></span>
                                                        <span className="status-label">{q.status}</span>
                                                    </div>
                                                </div>
                                                <h3 className="question-card-text">{q.question_text}</h3>
                                            </div>
                                            <div className="card-actions-corner" onClick={e => e.stopPropagation()}>
                                                <button
                                                    className={`btn-status-toggle ${q.status === 'ACTIVE' ? 'active' : 'inactive'}`}
                                                    title={q.status === 'ACTIVE' ? 'Deactivate Question' : 'Activate Question'}
                                                    onClick={(e) => { e.stopPropagation(); handleStatusToggle(q.id, q.status); }}
                                                >
                                                    <Power size={16} />
                                                </button>
                                                <button
                                                    className="btn-pencil"
                                                    title="Edit Question"
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(q); }}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-footer-info">
                                            <div className="meta-info">
                                                <Trophy size={14} className="icon" />
                                                <span>{categories.find(s => s.id === q.sub_category_id)?.name || 'General'}</span>
                                            </div>
                                            <div className="meta-info">
                                                <AlertCircle size={14} className="icon" />
                                                <span>{new Date(q.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="card empty-state">
                                    <AlertCircle size={48} className="text-muted" />
                                    <p>No questions found matching the selected filters.</p>
                                </div>
                            )}
                        </div>

                    </>
                )}

                {/* Create/Edit Form View */}
                {(viewMode === 'CREATE' || viewMode === 'EDIT') && (
                    <div className="card animate-fadeIn" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="auth-logo" style={{ width: '40px', height: '40px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <PlusCircle className="text-primary" size={24} />
                                </div>
                                <h3>{viewMode === 'EDIT' ? 'Modify Question' : 'Add New Question'}</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {viewMode === 'EDIT' && (
                                    <button className="btn-secondary" onClick={handleCancelEdit} style={{ height: '36px', padding: '0 1rem' }}>Cancel</button>
                                )}
                                <div className="badge">{formData.difficulty}</div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="form-grid" style={{ marginTop: '1.5rem' }}>
                            <div className="form-group">
                                <label>Sub Category</label>
                                <select
                                    value={formData.sub_category_id}
                                    onChange={e => setFormData({ ...formData, sub_category_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select a Sub Category...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Attachment (Optional)</label>
                                <div style={{
                                    border: '2px dashed var(--border-color)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    background: 'rgba(255, 255, 255, 0.02)'
                                }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            if (e.target.files && e.target.files[0]) {
                                                setFormData({ ...formData, attachment: e.target.files[0] });
                                            }
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer',
                                            zIndex: 5
                                        }}
                                    />
                                    {formData.attachment ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10b981' }}>
                                            <CheckCircle2 size={18} />
                                            <span>{formData.attachment.name}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setFormData({ ...formData, attachment: null });
                                                }}
                                                style={{ marginLeft: '1rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10, position: 'relative' }}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : formData.existing_image_url ? (
                                        <div style={{ position: 'relative', width: '100%', height: '150px', display: 'flex', justifyContent: 'center' }}>
                                            <img
                                                src={formData.existing_image_url}
                                                alt="Current attachment"
                                                style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '4px' }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                background: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                padding: '4px',
                                                fontSize: '0.8rem'
                                            }}>
                                                Click to replace image
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                            <PlusCircle size={24} />
                                            <span>Click to Upload Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Question Text</label>
                                <textarea
                                    placeholder="Write the question text clearly..."
                                    value={formData.question_text}
                                    onChange={e => setFormData({ ...formData, question_text: e.target.value })}
                                    required
                                    style={{ minHeight: '120px' }}
                                />
                            </div>

                            <div className="options-grid full-width" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label>Option A</label>
                                    <input type="text" placeholder="First choice" value={formData.option_a} onChange={e => setFormData({ ...formData, option_a: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Option B</label>
                                    <input type="text" placeholder="Second choice" value={formData.option_b} onChange={e => setFormData({ ...formData, option_b: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Option C</label>
                                    <input type="text" placeholder="Third choice" value={formData.option_c} onChange={e => setFormData({ ...formData, option_c: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Option D</label>
                                    <input type="text" placeholder="Fourth choice" value={formData.option_d} onChange={e => setFormData({ ...formData, option_d: e.target.value })} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Correct Choice</label>
                                <select value={formData.correct_option} onChange={e => setFormData({ ...formData, correct_option: e.target.value as any })} required>
                                    <option value="A">Choice A</option>
                                    <option value="B">Choice B</option>
                                    <option value="C">Choice C</option>
                                    <option value="D">Choice D</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Difficulty Level</label>
                                <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })} required>
                                    <option value="EASY">EASY</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HARD">HARD</option>
                                </select>
                            </div>

                            <div className="form-group full-width" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    {viewMode === 'EDIT' ? 'Update Details' : 'Save Question'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Question Detail Modal (Fixed outside animated parent) */}
            {selectedQuestion && (
                <div className="modal-overlay" onClick={() => setSelectedQuestion(null)} style={{ zIndex: 9999 }}>
                    <div className="card modal-content animate-fadeIn" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2>Question Preview</h2>
                                <p className="subtitle" style={{ marginBottom: 0 }}>Review all details for this quiz item.</p>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedQuestion(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-scroll-area">
                            <div className="detail-grid">
                                <div className="detail-item full-width">
                                    <label>Question Content</label>
                                    <div className="detail-value title">{selectedQuestion.question_text}</div>
                                </div>
                                <div className="detail-item">
                                    <label>Level</label>
                                    <div className="detail-value">
                                        <span className={`badge ${selectedQuestion.difficulty.toLowerCase()}`}>
                                            {selectedQuestion.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <label>System Status</label>
                                    <div className="detail-value">
                                        <span className={`status-dot ${selectedQuestion.status === 'ACTIVE' ? 'active' : 'inactive'}`}></span>
                                        {selectedQuestion.status}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <label>Answer A</label>
                                    <div className={`detail-value ${selectedQuestion.correct_option === 'A' ? 'success' : ''}`}>
                                        {selectedQuestion.option_a}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <label>Answer B</label>
                                    <div className={`detail-value ${selectedQuestion.correct_option === 'B' ? 'success' : ''}`}>
                                        {selectedQuestion.option_b}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <label>Answer C</label>
                                    <div className={`detail-value ${selectedQuestion.correct_option === 'C' ? 'success' : ''}`}>
                                        {selectedQuestion.option_c}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <label>Answer D</label>
                                    <div className={`detail-value ${selectedQuestion.correct_option === 'D' ? 'success' : ''}`}>
                                        {selectedQuestion.option_d}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <label>Final Answer</label>
                                    <div className="detail-value" style={{ fontWeight: 'bold', color: '#10b981' }}>
                                        Choice {selectedQuestion.correct_option}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <label>Date Added</label>
                                    <div className="detail-value">
                                        {new Date(selectedQuestion.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setSelectedQuestion(null)}>
                                Dismiss
                            </button>
                            <button className="btn-primary" onClick={() => { setSelectedQuestion(null); handleEdit(selectedQuestion); }}>
                                Edit This Question
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuizManagement;
