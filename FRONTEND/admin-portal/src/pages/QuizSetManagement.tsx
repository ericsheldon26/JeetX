import React, { useEffect, useState } from 'react';
import {
    Trophy,
    PlusCircle,
    List,
    HelpCircle,
    CheckCircle2,
    Loader2,
    Search,
    Settings,
    Layout,
    Target,
    Filter,
    Pencil,
    Trash2,
    X,
    Power
} from 'lucide-react';
import { quizApi } from '../api/adminApi';

interface Category {
    id: string;
    name: string;
    description: string;
    icon_url: string | null;
    display_order: number;
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
    difficulty: string;
    status: string;
}

interface QuizSet {
    id: string;
    name: string;
    mode: 'TOURNAMENT' | 'PRACTICE';
    sub_category_id: string;
    total_questions: number;
    is_randomized: boolean;
    difficulty_distribution: {
        EASY: number;
        MEDIUM: number;
        HARD: number;
    };
    fixed_question_ids: string[];
    questions?: Question[];
    created_at: string;
    status: 'ACTIVE' | 'INACTIVE';
}

const QuizSetManagement: React.FC = () => {
    // UI States
    const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'EDIT'>('LIST');
    const [selectedSet, setSelectedSet] = useState<QuizSet | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [fetchingDetail, setFetchingDetail] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data States
    const [categories, setCategories] = useState<Category[]>([]);
    const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
    const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
    const [fetchingQuestions, setFetchingQuestions] = useState(false);

    // Form States
    // const [selectedCategoryId, setSelectedCategoryId] = useState(''); // Removed nested logic
    // const [subCategories, setSubCategories] = useState<SubCategory[]>([]); // Removed nested logic
    const [formData, setFormData] = useState({
        name: '',
        sub_category_id: '',
        mode: 'TOURNAMENT' as 'TOURNAMENT' | 'PRACTICE',
        total_questions: 15,
        is_randomized: false,
        difficulty_distribution: {
            EASY: 15,
            MEDIUM: 0,
            HARD: 0
        },
        fixed_question_ids: [] as string[]
    });

    // Search for fixed questions
    const [questionSearch, setQuestionSearch] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', icon_url: '', display_order: 0 });
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const [filters, setFilters] = useState({
        sub_category_id: '',
        mode: '' as 'TOURNAMENT' | 'PRACTICE' | '',
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        console.log('🔄 Fetching initial data for Quiz Sets...');
        try {
            await fetchCategories();
            await fetchSets();
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await quizApi.getCategories();
            if (response.data.success) {
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchSets = async () => {
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries({ ...filters }).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
            );

            console.log('📡 Fetching Quiz Sets with Payload:', cleanFilters);
            const response = await quizApi.listQuestionSets(cleanFilters);
            if (response.data.success) {
                setQuizSets(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch quiz sets:', error);
        }
    };

    const applyFilters = () => {
        setLoading(true);
        fetchSets().finally(() => setLoading(false));
    };

    const fetchAvailableQuestions = async (subCatId: string) => {
        if (!subCatId) return;
        setFetchingQuestions(true);
        console.log(`🔍 Fetching ACTIVE questions for sub_category: ${subCatId}`);
        try {
            const response = await quizApi.listQuestions({
                sub_category_id: subCatId,
                status: 'ACTIVE'
            });
            if (response.data.success) {
                setAvailableQuestions(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setFetchingQuestions(false);
        }
    };

    // Auto-calculate difficulty distribution based on selected questions
    useEffect(() => {
        if (formData.is_randomized) return;
        const currentIds = formData.fixed_question_ids || [];
        const selected = availableQuestions.filter(q => currentIds.includes(q.id));
        const distribution = {
            EASY: selected.filter(q => q.difficulty === 'EASY').length,
            MEDIUM: selected.filter(q => q.difficulty === 'MEDIUM').length,
            HARD: selected.filter(q => q.difficulty === 'HARD').length
        };

        setFormData(prev => {
            // Only update if something actually changed to avoid infinite loops
            if (JSON.stringify(prev.difficulty_distribution) !== JSON.stringify(distribution)) {
                return { ...prev, difficulty_distribution: distribution };
            }
            return prev;
        });
    }, [formData.fixed_question_ids, availableQuestions, formData.is_randomized]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const catId = e.target.value;
        setFormData(prev => ({ ...prev, sub_category_id: catId, fixed_question_ids: [] }));
        setAvailableQuestions([]);
        if (catId) {
            fetchAvailableQuestions(catId);
        }
    };

    // Removed handleSubCategoryChange as it is no longer needed

    const handleSelectSet = async (set: QuizSet) => {
        setSelectedSet(set);
        setFetchingDetail(true);
        try {
            const response = await quizApi.getQuestionSetDetail(set.id);
            if (response.data.success) {
                setSelectedSet(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch set details:', error);
            // If detail fetch fails, we still show the basic info we have
        } finally {
            setFetchingDetail(false);
        }
    };

    const toggleQuestionSelection = (qId: string) => {
        setFormData(prev => {
            const isSelected = prev.fixed_question_ids.includes(qId);
            if (isSelected) {
                return { ...prev, fixed_question_ids: prev.fixed_question_ids.filter(id => id !== qId) };
            } else {
                if (prev.fixed_question_ids.length >= prev.total_questions) {
                    alert(`You can only select up to ${prev.total_questions} questions.`);
                    return prev;
                }
                return { ...prev, fixed_question_ids: [...prev.fixed_question_ids, qId] };
            }
        });
    };

    const handleEdit = (set: QuizSet) => {
        setEditingId(set.id);
        setFormData({
            name: set.name,
            sub_category_id: set.sub_category_id,
            mode: set.mode,
            total_questions: set.total_questions,
            is_randomized: set.is_randomized,
            difficulty_distribution: set.difficulty_distribution || { EASY: 0, MEDIUM: 0, HARD: 0 },
            fixed_question_ids: set.fixed_question_ids || []
        });

        // Populate available questions for the set's subcategory
        // We need to fetch this so the selection list gets populated
        fetchAvailableQuestions(set.sub_category_id);

        // In flat structure, sub_category_id IS the category id
        // No need to set selectedCategoryId or subCategories state separately

        setViewMode('EDIT');
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            sub_category_id: '',
            mode: 'TOURNAMENT',
            total_questions: 15,
            is_randomized: false,
            difficulty_distribution: { EASY: 15, MEDIUM: 0, HARD: 0 },
            fixed_question_ids: []
        });
    };

    const handleCancelEdit = () => {
        resetForm();
        setViewMode('LIST');
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this quiz set? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await quizApi.deleteQuestionSet(id);
            if (response.data.success) {
                // Remove from local state
                setQuizSets(prev => prev.filter(s => s.id !== id));
                if (selectedSet?.id === id) {
                    setSelectedSet(null);
                }
            }
        } catch (error: any) {
            console.error('Failed to delete set:', error);
            alert(`Failed to delete: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Selected count must equal total count
        if (formData.fixed_question_ids.length !== formData.total_questions) {
            alert(`Please select exactly ${formData.total_questions} questions. Currently selected: ${formData.fixed_question_ids.length}`);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                // If randomized is true, send empty fixed_question_ids as requested
                // If randomized is false, send the actual IDs
                fixed_question_ids: formData.is_randomized ? [] : formData.fixed_question_ids
            };

            let response;
            if (viewMode === 'EDIT' && editingId) {
                response = await quizApi.updateQuestionSet(editingId, payload);
            } else {
                response = await quizApi.createQuestionSet(payload);
            }

            if (response.data.success) {
                alert(viewMode === 'EDIT' ? 'Question set updated successfully!' : 'Question set created successfully!');
                setViewMode('LIST');
                fetchInitialData();
                resetForm(); // Resets form
            }
        } catch (error: any) {
            console.error('Failed to create set:', error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        if (!window.confirm(`Are you sure you want to make this set ${newStatus}?`)) return;

        try {
            const response = await quizApi.updateQuestionSetStatus(id, newStatus);
            if (response.data.success) {
                setQuizSets(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
            } else {
                alert(`Error: ${response.data.message || 'Failed to update status'}`);
            }
        } catch (error: any) {
            console.error('Failed to update status:', error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setValidationErrors({});
        console.log('Creating category:', newCategory);
        try {
            const response = await quizApi.createCategory(newCategory);
            if (response.data.success) {
                alert('Category created successfully!');
                setShowCategoryModal(false);
                setNewCategory({ name: '', description: '', icon_url: '', display_order: 0 });
                fetchCategories(); // Refresh list
            }
        } catch (error: any) {
            console.error('Failed to create category:', error);
            if (error.response?.data?.error === 'VALIDATION_ERROR' && error.response?.data?.details) {
                const errors: { [key: string]: string } = {};
                error.response.data.details.forEach((err: any) => {
                    errors[err.field] = err.message;
                });
                setValidationErrors(errors);
            } else {
                alert(`Error: ${error.response?.data?.message || error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredQuestions = availableQuestions.filter(q =>
        q.question_text.toLowerCase().includes(questionSearch.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '60vh' }}>
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    // Removed allSubCategories flatMap causing crash
    // We can lookup names directly from categories array

    return (
        <div className="quiz-set-page animate-fadeIn">
            <header className="page-header">
                <div className="header-info">
                    <h1>{viewMode === 'EDIT' ? 'Edit Question Set' : (viewMode === 'CREATE' ? 'Create Question Set' : 'Quiz Sets Management')}</h1>
                    <p className="subtitle">Group questions into tournament or practice sets.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-secondary"
                        onClick={() => setShowCategoryModal(true)}
                    >
                        <PlusCircle size={20} />
                        Create Sub Category
                    </button>
                    <button
                        className={viewMode === 'LIST' ? 'btn-primary' : 'btn-secondary'}
                        onClick={handleCancelEdit}
                    >
                        <List size={20} />
                        View Sets
                    </button>
                    <button
                        className={viewMode === 'CREATE' ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => { resetForm(); setViewMode('CREATE'); }}
                    >
                        <PlusCircle size={20} />
                        Create New Set
                    </button>
                </div>
            </header>

            {viewMode === 'LIST' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Filter Bar */}
                    <div className="card" style={{ padding: '1.25rem' }}>
                        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
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
                                <label style={{ fontSize: '0.8rem' }}>Mode</label>
                                <select
                                    value={filters.mode}
                                    onChange={e => setFilters({ ...filters, mode: e.target.value as any })}
                                    style={{ padding: '0.5rem', height: '42px' }}
                                >
                                    <option value="">All Modes</option>
                                    <option value="TOURNAMENT">TOURNAMENT</option>
                                    <option value="PRACTICE">PRACTICE</option>
                                </select>
                            </div>
                            <button className="btn-primary" onClick={applyFilters} style={{ height: '42px', marginTop: 0 }}>
                                <Filter size={18} />
                                <span>Apply Filters</span>
                            </button>
                        </div>
                    </div>

                    <div className="questions-container animate-fadeIn">
                        {quizSets.length > 0 ? (
                            quizSets.map(set => (
                                <div
                                    key={set.id}
                                    className="question-horizontal-card animate-fadeIn"
                                    onClick={() => handleSelectSet(set)}
                                >
                                    <div className="card-top-info" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <div className="question-main-content">
                                            <div className="question-header-row">
                                                <span className={`badge ${set.mode === 'TOURNAMENT' ? 'hard' : 'easy'}`}>
                                                    {set.mode}
                                                </span>
                                                {set.is_randomized && <span className="badge medium">Randomized</span>}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <h3 className="question-card-text">{set.name}</h3>
                                                <span className={`status-dot ${(set.status || 'ACTIVE') === 'ACTIVE' ? 'active' : 'inactive'}`} title={set.status || 'ACTIVE'}></span>
                                            </div>
                                        </div>
                                        <div className="card-actions-corner" onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className={`btn-status-toggle ${(set.status || 'ACTIVE') === 'ACTIVE' ? 'active' : 'inactive'}`}
                                                title={(set.status || 'ACTIVE') === 'ACTIVE' ? 'Deactivate Set' : 'Activate Set'}
                                                onClick={(e) => { e.stopPropagation(); handleStatusToggle(set.id, set.status || 'ACTIVE'); }}
                                                style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <Power size={16} />
                                            </button>
                                            <button
                                                className="btn-pencil"
                                                title="Edit Set"
                                                onClick={(e) => { e.stopPropagation(); handleEdit(set); }}
                                                style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="btn-trash"
                                                title="Delete Set"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(set.id); }}
                                                style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-footer-info">
                                        <div className="meta-info">
                                            <HelpCircle size={14} className="icon" />
                                            <span>{set.total_questions} Questions</span>
                                        </div>
                                        <div className="meta-info">
                                            <Target size={14} className="icon" />
                                            <span>
                                                {categories.find(s => s.id === set.sub_category_id)?.name || set.sub_category_id || 'Unknown Category'}
                                            </span>
                                        </div>
                                        <div className="meta-info">
                                            <Layout size={14} className="icon" />
                                            <span>{new Date(set.created_at || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card empty-state" style={{ gridColumn: '1 / -1' }}>
                                <Trophy size={48} className="text-muted" />
                                <p>No quiz sets found matching the selected filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="card animate-fadeIn" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="auth-logo" style={{ width: '40px', height: '40px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {viewMode === 'EDIT' ? <Pencil className="text-primary" size={24} /> : <PlusCircle className="text-primary" size={24} />}
                            </div>
                            <h3>{viewMode === 'EDIT' ? 'Modify Question Set' : 'Create New Set'}</h3>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="form-grid" style={{ marginTop: '1.5rem' }}>
                        <div className="form-group full-width">
                            <label><Layout size={16} /> Set Name</label>
                            <input
                                type="text"
                                placeholder="e.g. History Mega Tournament"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><HelpCircle size={16} /> Mode</label>
                            <select
                                value={formData.mode}
                                onChange={e => setFormData({ ...formData, mode: e.target.value as any })}
                            >
                                <option value="TOURNAMENT">TOURNAMENT</option>
                                <option value="PRACTICE">PRACTICE</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label><Target size={16} /> Total Questions</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.total_questions}
                                onChange={e => setFormData({ ...formData, total_questions: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Sub Category</label>
                            <select
                                value={formData.sub_category_id}
                                onChange={handleCategoryChange}
                                required
                            >
                                <option value="">Select Sub Category...</option>
                                {categories.length > 0 ? (
                                    categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                ) : (
                                    <option disabled>No categories available</option>
                                )}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label><Settings size={16} /> Set Configuration</label>
                            <div className="radio-group">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="randomized"
                                        checked={formData.is_randomized}
                                        onChange={() => setFormData({ ...formData, is_randomized: true })}
                                    />
                                    <div className="radio-label">
                                        <span>Randomized</span>
                                        <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>Backend picks questions based on difficulty</p>
                                    </div>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="randomized"
                                        checked={!formData.is_randomized}
                                        onChange={() => setFormData({ ...formData, is_randomized: false })}
                                    />
                                    <div className="radio-label">
                                        <span>Fixed Selection</span>
                                        <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>I want to hand-pick specific questions</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {formData.sub_category_id && (
                            <div className="form-group full-width animate-fadeIn" style={{ marginTop: '1rem' }}>
                                <div className="card" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', marginBottom: '1.5rem' }}>
                                    <label style={{ marginBottom: '1rem', display: 'block' }}>Difficulty Distribution (Auto-calculated)</label>
                                    <div style={{ display: 'flex', gap: '2rem' }}>
                                        <div className="stat-pill">
                                            <span className="label">EASY:</span>
                                            <span className="value">{formData.difficulty_distribution.EASY}</span>
                                        </div>
                                        <div className="stat-pill">
                                            <span className="label">MEDIUM:</span>
                                            <span className="value">{formData.difficulty_distribution.MEDIUM}</span>
                                        </div>
                                        <div className="stat-pill">
                                            <span className="label">HARD:</span>
                                            <span className="value">{formData.difficulty_distribution.HARD}</span>
                                        </div>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <div className={`badge ${formData.fixed_question_ids.length === formData.total_questions ? 'success' : 'warning'}`}>
                                                Selected: {formData.fixed_question_ids.length} / {formData.total_questions}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem' }}>
                                    <div className="search-bar" style={{ marginBottom: '1rem' }}>
                                        <Search size={18} style={{ marginLeft: '1rem' }} />
                                        <input
                                            type="text"
                                            placeholder="Search active questions..."
                                            value={questionSearch}
                                            onChange={e => setQuestionSearch(e.target.value)}
                                            style={{ border: 'none', background: 'transparent' }}
                                        />
                                    </div>

                                    <div className="question-selection-list" style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {fetchingQuestions ? (
                                            <div className="flex-center" style={{ padding: '2rem' }}>
                                                <Loader2 className="animate-spin" size={24} />
                                            </div>
                                        ) : filteredQuestions.length > 0 ? (
                                            filteredQuestions.map(q => {
                                                const isSelected = formData.fixed_question_ids.includes(q.id);
                                                return (
                                                    <div
                                                        key={q.id}
                                                        className={`question-selection-item ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => toggleQuestionSelection(q.id)}
                                                        style={{
                                                            padding: '0.75rem 1rem',
                                                            borderRadius: '8px',
                                                            background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                                                            border: `1px solid ${isSelected ? 'var(--primary)' : 'transparent'}`,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '1rem',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <div className={`check-box ${isSelected ? 'checked' : ''}`} style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '4px',
                                                            border: '2px solid var(--border-color)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: isSelected ? 'var(--primary)' : 'transparent',
                                                            borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)'
                                                        }}>
                                                            {isSelected && <CheckCircle2 size={14} color="white" />}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '0.9rem' }}>{q.question_text}</div>
                                                            <span className="badge mini" style={{ fontSize: '0.65rem', marginTop: '4px' }}>{q.difficulty}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No active questions found in this sub-category.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="form-group full-width" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button type="button" className="btn-secondary" onClick={() => setViewMode('LIST')}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                {viewMode === 'EDIT' ? 'Update Set' : 'Create Quality Set'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Set Detail Modal */}
            {selectedSet && (
                <div className="modal-overlay" onClick={() => setSelectedSet(null)}>
                    <div className="card modal-content animate-fadeIn" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '85vh' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{selectedSet.name}</h2>
                                <p className="subtitle" style={{ margin: 0 }}>
                                    {selectedSet.mode} • {selectedSet.total_questions} Questions • {selectedSet.is_randomized ? 'Randomized' : 'Fixed'}
                                </p>
                            </div>
                            <button className="btn-icon" onClick={() => setSelectedSet(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto', minHeight: '200px' }}>
                            {fetchingDetail ? (
                                <div className="flex-center" style={{ padding: '4rem' }}>
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                    <p style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>Loading questions...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="difficulty-stats" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div className="stat-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                            <span className="label" style={{ color: '#10b981' }}>EASY:</span>
                                            <span className="value">{selectedSet.difficulty_distribution.EASY}</span>
                                        </div>
                                        <div className="stat-pill" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                                            <span className="label" style={{ color: '#f59e0b' }}>MEDIUM:</span>
                                            <span className="value">{selectedSet.difficulty_distribution.MEDIUM}</span>
                                        </div>
                                        <div className="stat-pill" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                            <span className="label" style={{ color: '#ef4444' }}>HARD:</span>
                                            <span className="value">{selectedSet.difficulty_distribution.HARD}</span>
                                        </div>
                                    </div>

                                    <h4 style={{ marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                        Questions in this Set
                                    </h4>

                                    <div className="set-questions-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {selectedSet.questions && selectedSet.questions.length > 0 ? (
                                            selectedSet.questions.map((q, idx) => (
                                                <div key={q.id} style={{
                                                    padding: '1rem',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--border-color)',
                                                    position: 'relative'
                                                }}>
                                                    <span style={{
                                                        position: 'absolute',
                                                        left: '-0.5rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'var(--primary)',
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
                                                    }}>{idx + 1}</span>
                                                    <div style={{ marginLeft: '1rem' }}>
                                                        <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{q.question_text}</p>
                                                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                                                            <span className={`badge mini ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                                                                <span style={{ color: 'var(--primary)' }}>Correct: {q.correct_option}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                                                {selectedSet.is_randomized
                                                    ? "Questions are dynamically selected by the system during the quiz."
                                                    : "No fixed questions linked to this set."}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Category Modal */}
            {showCategoryModal && (
                <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
                    <div className="card modal-content animate-fadeIn" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="modal-header" style={{ flexShrink: 0 }}>
                            <h3 style={{ margin: 0 }}>Create Sub Category</h3>
                            <button className="btn-icon" onClick={() => setShowCategoryModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Sub Category Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Science"
                                        value={newCategory.name}
                                        onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                                    />
                                    {validationErrors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                                    <input
                                        type="text"
                                        placeholder="Optional description"
                                        value={newCategory.description}
                                        onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                                    />
                                    {validationErrors.description && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.description}</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div className="form-group" style={{ flex: '1 1 200px' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Icon URL</label>
                                        <input
                                            type="text"
                                            placeholder="Optional icon URL"
                                            value={newCategory.icon_url}
                                            onChange={e => setNewCategory({ ...newCategory, icon_url: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                                        />
                                        {validationErrors.icon_url && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.icon_url}</span>}
                                    </div>
                                    <div className="form-group" style={{ flex: '1 1 100px' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Display Order</label>
                                        <input
                                            type="number"
                                            value={newCategory.display_order}
                                            onChange={e => setNewCategory({ ...newCategory, display_order: parseInt(e.target.value) || 0 })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                                        />
                                        {validationErrors.display_order && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.display_order}</span>}
                                    </div>
                                </div>

                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={isSubmitting}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            width: '100%',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
                                        Create Sub Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizSetManagement;
