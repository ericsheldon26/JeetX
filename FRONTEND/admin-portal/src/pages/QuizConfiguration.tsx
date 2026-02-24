import React, { useState, useEffect } from 'react';
import {
    Trophy,
    Gamepad2,
    Save,
    Loader2,
    Clock,
    FileText,
    Eye,
    X,
    Plus,
    Edit2,
    ArrowLeft,
    Activity,
    Calendar,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { quizApi } from '../api/adminApi';

interface Category {
    id: string;
    name: string;
    description: string;
    icon_url: string | null;
}

const QuizConfiguration: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'TOURNAMENT' | 'PRACTICE'>('TOURNAMENT');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data for dropdowns
    const [allSubCategories, setAllSubCategories] = useState<{ id: string, name: string, categoryName: string }[]>([]);

    // Existing config ID (if any)
    const [existingConfigId, setExistingConfigId] = useState<string | null>(null);
    const [configStatus, setConfigStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
    const [showConfigModal, setShowConfigModal] = useState(false);

    // Practice Config State
    // List View State
    const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');
    const [practiceConfigsList, setPracticeConfigsList] = useState<any[]>([]);

    // Tournament Config State
    const [tournamentViewMode, setTournamentViewMode] = useState<'LIST' | 'FORM'>('LIST');
    const [tournamentsList, setTournamentsList] = useState<any[]>([]);
    const [tournamentStats, setTournamentStats] = useState({
        total: 0,
        active: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0
    });

    // Filters & Selection
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterSubCategory, setFilterSubCategory] = useState<string>('');
    const [selectedTournament, setSelectedTournament] = useState<any | null>(null);
    const [existingTournamentId, setExistingTournamentId] = useState<string | null>(null);

    const [tournamentConfig, setTournamentConfig] = useState({
        sub_category_id: '',
        question_set_id: '',
        slot_name: '',
        entry_coins: 50,
        start_time: '',
        end_time: '',
        max_players: 10,
        timer_duration: 300,
        platform_fee_percentage: 5,
        reward_distribution: JSON.stringify({
            "RANK_1": 60,
            "RANK_2": 30,
            "RANK_3": 10
        }, null, 2),
        terms_content: `Tournament Mode Terms & Conditions:

1. Entry Fee: Participation requires an entry fee as specified.
2. Ranking: Winners are decided based on score and time taken.
3. Rewards: Prize pool is distributed according to the rank table.
4. Disqualification: Any malpractice will lead to immediate ban.
5. Refund: No refunds after tournament starts.

By joining, you agree to these rules.`,
        terms_version: 'v1.0'
    });
    const [questionSets, setQuestionSets] = useState<any[]>([]);

    // Practice Config State
    const initialConfigState = {
        sub_category_id: '',
        entry_coins: 20,
        timer_enabled: true,
        timer_duration: 300,
        terms_content: `Practice Mode Terms & Conditions:

1. Entry Fee: 20 coins will be deducted from your wallet upon starting the practice quiz.

2. Refund Policy:
   - Score 80% or above: Get 100% refund (20 coins back)
   - Score 60-79%: Get 50% refund (10 coins back)
   - Score below 60%: No refund

3. Timer: You have 5 minutes to complete all questions. The quiz will auto-submit when time expires.

4. Questions: Once you start, you cannot pause or restart the quiz.

5. Results: Your results will be shown immediately after submission.

By accepting these terms, you agree to participate under these conditions.`,
        timer_type: 'TOTAL',
        refund_rules: JSON.stringify({
            "0": 0,
            "60": 50,
            "80": 100
        }, null, 2),
        terms_version: 'v1.0'
    };

    const [practiceConfigs, setPracticeConfig] = useState(initialConfigState);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await quizApi.getCategories();
            if (response.data.success) {
                // Map flat categories to the structure used by the component
                const subs = response.data.data.map((cat: Category) => ({
                    id: cat.id,
                    name: cat.name,
                    categoryName: 'Category' // placeholder as we don't have parents anymore
                }));
                setAllSubCategories(subs);

                // Set default if available
                if (subs.length > 0) {
                    setPracticeConfig(prev => ({ ...prev, sub_category_id: subs[0].id }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    // Fetch all configs when entering Practice tab or List mode
    useEffect(() => {
        if (activeTab === 'PRACTICE' && viewMode === 'LIST') {
            fetchAllConfigs();
        }
    }, [activeTab, viewMode]);

    const fetchAllConfigs = async () => {
        try {
            const response = await quizApi.getPracticeConfig();
            if (response.data.success) {
                setPracticeConfigsList(Array.isArray(response.data.data) ? response.data.data : []);
            }
        } catch (error) {
            console.error('Failed to fetch practice configs:', error);
        }
    };

    // Helper to get category name
    const getSubCategoryName = (subId: string) => {
        const sub = allSubCategories.find(s => s.id === subId);
        return sub ? sub.name : 'Unknown';
    };

    const handleEditConfig = (config: any) => {
        setExistingConfigId(config.id);
        setConfigStatus(config.status || 'ACTIVE');
        setPracticeConfig({
            sub_category_id: config.sub_category_id,
            entry_coins: config.entry_coins,
            timer_enabled: config.timer_enabled,
            timer_duration: config.timer_duration,
            terms_content: config.terms_content,
            timer_type: config.timer_type || 'TOTAL',
            refund_rules: typeof config.refund_rules === 'string'
                ? config.refund_rules
                : JSON.stringify(config.refund_rules, null, 2),
            terms_version: config.terms_version
        });
        setViewMode('FORM');
    };

    // Tournament Effects and Handlers
    useEffect(() => {
        if (activeTab === 'TOURNAMENT' && tournamentViewMode === 'LIST') {
            fetchTournaments();
            fetchTournamentStats();
        }
    }, [activeTab, tournamentViewMode, filterStatus, filterSubCategory]); // Refetch when filters change

    const fetchTournamentStats = async () => {
        try {
            const response = await quizApi.getTournamentStats();
            if (response.data.success) {
                setTournamentStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch tournament stats:', error);
        }
    };

    const fetchTournaments = async () => {
        try {
            const params: any = { limit: 50 };
            if (filterStatus) params.status = filterStatus;
            if (filterSubCategory) params.sub_category_id = filterSubCategory;

            const response = await quizApi.listTournaments(params);
            if (response.data.success) {
                setTournamentsList(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch tournaments:', error);
        }
    };

    const handleTournamentClick = async (id: string) => {
        try {
            const response = await quizApi.getTournamentDetail(id);
            if (response.data.success) {
                setSelectedTournament(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch tournament details:', error);
        }
    };

    const handleEditTournament = (tournament: any) => {
        setExistingTournamentId(tournament.id);
        setTournamentConfig({
            sub_category_id: tournament.sub_category_id,
            question_set_id: tournament.question_set_id,
            slot_name: tournament.slot_name,
            entry_coins: tournament.entry_coins,
            start_time: new Date(tournament.start_time).toISOString().slice(0, 16), // Format for datetime-local
            end_time: new Date(tournament.end_time).toISOString().slice(0, 16),
            max_players: tournament.max_players,
            timer_duration: tournament.timer_duration,
            platform_fee_percentage: tournament.platform_fee_percentage,
            reward_distribution: JSON.stringify(tournament.reward_distribution, null, 2),
            terms_content: tournament.terms_content || '',
            terms_version: tournament.terms_version || 'v1.0'
        });
        setSelectedTournament(null); // Close Details Modal
        setTournamentViewMode('FORM');
    };

    const handleCancelTournament = async (id: string) => {
        if (!window.confirm('Are you sure you want to cancel this tournament? This action cannot be undone.')) return;

        try {
            const response = await quizApi.cancelTournament(id);
            if (response.data.success) {
                alert('Tournament cancelled successfully');
                setSelectedTournament(null);
                fetchTournaments(); // Refresh list
                fetchTournamentStats(); // Refresh stats
            }
        } catch (error: any) {
            console.error('Failed to cancel tournament:', error);
            alert(`Error: ${error.response?.data?.message || 'Failed to cancel tournament'}`);
        }
    };

    useEffect(() => {
        if (tournamentConfig.sub_category_id) {
            fetchQuestionSets(tournamentConfig.sub_category_id);
        }
    }, [tournamentConfig.sub_category_id]);

    const fetchQuestionSets = async (subId: string) => {
        try {
            const response = await quizApi.listQuestionSets({
                sub_category_id: subId,
                mode: 'TOURNAMENT'
            });
            if (response.data.success) {
                setQuestionSets(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch question sets:', error);
        }
    };

    const handleTournamentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Parse reward distribution
            let parsedRewards;
            try {
                parsedRewards = JSON.parse(tournamentConfig.reward_distribution);
            } catch (err) {
                alert('Invalid JSON in Reward Distribution');
                setIsSubmitting(false);
                return;
            }

            const payload = {
                ...tournamentConfig,
                reward_distribution: parsedRewards,
                // Ensure dates are ISO strings if simple input is used
                start_time: new Date(tournamentConfig.start_time).toISOString(),
                end_time: new Date(tournamentConfig.end_time).toISOString()
            };

            let response;
            if (existingTournamentId) {
                response = await quizApi.updateTournament(existingTournamentId, payload);
            } else {
                response = await quizApi.createTournament(payload);
            }

            if (response.data.success) {
                alert(`Tournament ${existingTournamentId ? 'updated' : 'created'} successfully!`);
                // Reset and go back to list
                setTournamentConfig({
                    sub_category_id: '',
                    question_set_id: '',
                    slot_name: '',
                    entry_coins: 50,
                    start_time: '',
                    end_time: '',
                    max_players: 10,
                    timer_duration: 300,
                    platform_fee_percentage: 5,
                    reward_distribution: JSON.stringify({
                        "RANK_1": 60,
                        "RANK_2": 30,
                        "RANK_3": 10
                    }, null, 2),
                    terms_content: `Tournament Mode Terms & Conditions:

1. Entry Fee: Participation requires an entry fee as specified.
2. Ranking: Winners are decided based on score and time taken.
3. Rewards: Prize pool is distributed according to the rank table.
4. Disqualification: Any malpractice will lead to immediate ban.
5. Refund: No refunds after tournament starts.

By joining, you agree to these rules.`,
                    terms_version: 'v1.0'
                });
                setExistingTournamentId(null);
                setTournamentViewMode('LIST');
            }
        } catch (error: any) {
            console.error('Failed to save tournament:', error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateNew = () => {
        setExistingConfigId(null);
        setConfigStatus('ACTIVE');
        setPracticeConfig(initialConfigState);
        setViewMode('FORM');
    };

    const fetchPracticeConfig = async (subId: string) => {
        try {
            const response = await quizApi.getPracticeConfig(subId);
            if (response.data.success && response.data.data) {
                // Fix: Handle if data is an array (take the first one) or object
                let config = response.data.data;
                if (Array.isArray(config)) {
                    config = config.length > 0 ? config[0] : null;
                }

                if (config) {
                    console.log('📥 Fetched Config:', config);
                    setExistingConfigId(config.id);
                    setConfigStatus(config.status || 'ACTIVE');
                    setPracticeConfig(prev => ({
                        ...prev,
                        entry_coins: config.entry_coins,
                        timer_enabled: config.timer_enabled,
                        timer_duration: config.timer_duration,
                        terms_content: config.terms_content,
                        timer_type: config.timer_type || 'TOTAL',
                        refund_rules: typeof config.refund_rules === 'string'
                            ? config.refund_rules
                            : JSON.stringify(config.refund_rules, null, 2),
                        terms_version: config.terms_version
                    }));
                } else {
                    console.log('⚠️ No sub-category config found (empty array)');
                    setExistingConfigId(null);
                }
            } else {
                setExistingConfigId(null);
            }
        } catch (error) {
            console.error('Failed to fetch config:', error);
            setExistingConfigId(null);
        }
    };

    const handlePracticeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Parse refund rules
        let parsedRefundRules;
        try {
            parsedRefundRules = JSON.parse(practiceConfigs.refund_rules);
        } catch (err) {
            alert('Invalid JSON in Refund Rules');
            setIsSubmitting(false);
            return;
        }

        const payload = {
            ...practiceConfigs,
            sub_category_id: practiceConfigs.sub_category_id,
            refund_rules: parsedRefundRules,
            status: configStatus
        };

        console.log('📤 Submitting Practice Config:', payload);

        try {
            let response;
            if (existingConfigId) {
                // Update
                response = await quizApi.updatePracticeConfig(existingConfigId, payload);
            } else {
                // Create
                response = await quizApi.createPracticeConfig(payload);
            }

            if (response.data.success) {
                alert(`Practice configuration ${existingConfigId ? 'updated' : 'created'} successfully!`);
                setViewMode('LIST'); // Go back to list after success
            }
        } catch (error: any) {
            console.error('Failed to save config:', error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusToggle = async () => {
        if (!existingConfigId) return;
        const newStatus = configStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            const response = await quizApi.updatePracticeConfigStatus(existingConfigId, newStatus);
            if (response.data.success) {
                setConfigStatus(newStatus);
            }
        } catch (error: any) {
            alert(`Failed to update status: ${error.message}`);
        }
    };

    return (
        <div className="quiz-config-page animate-fadeIn">
            <header className="page-header">
                <div className="header-info">
                    <h1>Quiz Configuration</h1>
                    <p className="subtitle">Manage global settings for Tournament and Practice modes.</p>
                </div>
            </header>

            <div className="content-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Tabs */}
                <div className="tabs" style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '0.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                }}>
                    <button
                        className={`tab-btn ${activeTab === 'TOURNAMENT' ? 'active' : ''}`}
                        onClick={() => setActiveTab('TOURNAMENT')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            background: activeTab === 'TOURNAMENT' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'TOURNAMENT' ? 'white' : 'var(--text-muted)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: 600,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Trophy size={18} />
                        TOURNAMENT
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'PRACTICE' ? 'active' : ''}`}
                        onClick={() => setActiveTab('PRACTICE')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            background: activeTab === 'PRACTICE' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'PRACTICE' ? 'white' : 'var(--text-muted)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: 600,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Gamepad2 size={18} />
                        PRACTICE
                    </button>
                </div>

                <div className="config-card card animate-fadeIn">
                    {activeTab === 'TOURNAMENT' ? (
                        tournamentViewMode === 'LIST' ? (
                            <div className="animate-fadeIn">
                                {/* Stats Cards */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '1rem',
                                    marginBottom: '2rem'
                                }}>
                                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
                                            <Activity size={24} color="#3b82f6" />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Active</p>
                                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#3b82f6' }}>{tournamentStats.active}</h2>
                                        </div>
                                    </div>
                                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
                                            <Calendar size={24} color="#10b981" />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Scheduled</p>
                                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>{tournamentStats.scheduled}</h2>
                                        </div>
                                    </div>
                                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
                                            <CheckCircle size={24} color="#f59e0b" />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Completed</p>
                                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#f59e0b' }}>{tournamentStats.completed}</h2>
                                        </div>
                                    </div>
                                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
                                            <XCircle size={24} color="#ef4444" />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Cancelled</p>
                                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#ef4444' }}>{tournamentStats.cancelled}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>Tournaments</h3>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.7 }}>Manage upcoming and active tournaments.</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {/* Filters */}
                                        <select
                                            value={filterSubCategory}
                                            onChange={(e) => setFilterSubCategory(e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white', maxWidth: '200px' }}
                                        >
                                            <option value="">All Sub Categories</option>
                                            {allSubCategories.map(sub => (
                                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                                            ))}
                                        </select>

                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                                        >
                                            <option value="">All Status</option>
                                            <option value="SCHEDULED">Scheduled</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>

                                        <button
                                            className="btn-secondary"
                                            onClick={fetchTournaments}
                                            title="Refresh List"
                                            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Loader2 size={18} />
                                        </button>
                                        <button
                                            className="btn-primary"
                                            onClick={() => {
                                                setExistingTournamentId(null);
                                                setTournamentConfig({
                                                    sub_category_id: '',
                                                    question_set_id: '',
                                                    slot_name: '',
                                                    entry_coins: 50,
                                                    start_time: '',
                                                    end_time: '',
                                                    max_players: 10,
                                                    timer_duration: 300,
                                                    platform_fee_percentage: 5,
                                                    reward_distribution: JSON.stringify({ "RANK_1": 60, "RANK_2": 30, "RANK_3": 10 }, null, 2),
                                                    terms_content: `Tournament Mode Terms & Conditions:

1. Entry Fee: Participation requires an entry fee as specified.
2. Ranking: Winners are decided based on score and time taken.
3. Rewards: Prize pool is distributed according to the rank table.
4. Disqualification: Any malpractice will lead to immediate ban.
5. Refund: No refunds after tournament starts.

By joining, you agree to these rules.`,
                                                    terms_version: 'v1.0'
                                                });
                                                setTournamentViewMode('FORM');
                                            }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            <Plus size={18} />
                                            Create
                                        </button>
                                    </div>
                                </div>

                                <div className="table-container" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Slot Name</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sub Category</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Entry / Fee</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Start Time</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Players</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tournamentsList.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                        No tournaments found. Create one above.
                                                    </td>
                                                </tr>
                                            ) : (
                                                tournamentsList.map((t) => (
                                                    <tr
                                                        key={t.id}
                                                        onClick={() => handleTournamentClick(t.id)}
                                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s' }}
                                                        className="hover-row"
                                                    >
                                                        <td style={{ padding: '1rem' }}>{t.slot_name}</td>
                                                        <td style={{ padding: '1rem' }}>{getSubCategoryName(t.sub_category_id)}</td>
                                                        <td style={{ padding: '1rem' }}>{t.entry_coins} (+{t.platform_fee_percentage}%)</td>
                                                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                                            {new Date(t.start_time).toLocaleString()}
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span className={`status-badge ${t.status?.toLowerCase()}`} style={{
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '20px',
                                                                background: t.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                                                color: t.status === 'ACTIVE' ? '#10b981' : '#3b82f6',
                                                                fontSize: '0.85rem',
                                                                fontWeight: 600
                                                            }}>
                                                                {t.status || 'SCHEDULED'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            {t.current_players || 0} / {t.max_players}
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            {(!t.status || t.status === 'SCHEDULED' || t.status === 'ACTIVE') && (
                                                                <button
                                                                    className="btn-icon danger"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCancelTournament(t.id);
                                                                    }}
                                                                    title="Cancel Tournament"
                                                                    style={{ color: '#ef4444', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10, position: 'relative' }}
                                                                >
                                                                    <XCircle size={18} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleTournamentSubmit} className="animate-fadeIn">
                                <div className="section-header" style={{ marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setTournamentViewMode('LIST')}
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                        <div className="icon-box" style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                            <Trophy size={24} color="#3b82f6" />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0 }}>{existingTournamentId ? 'Edit' : 'Create'} Tournament</h3>
                                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.7 }}>
                                                {existingTournamentId ? 'Update details for this slot.' : 'Define a new tournament slot.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Sub Category</label>
                                        <select
                                            value={tournamentConfig.sub_category_id}
                                            onChange={e => setTournamentConfig({ ...tournamentConfig, sub_category_id: e.target.value })}
                                            required
                                            style={{ padding: '0.75rem', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                                        >
                                            <option value="" disabled>Select Sub Category</option>
                                            {allSubCategories.map(sub => (
                                                <option key={sub.id} value={sub.id}>
                                                    {sub.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Question Set</label>
                                        <select
                                            value={tournamentConfig.question_set_id}
                                            onChange={e => setTournamentConfig({ ...tournamentConfig, question_set_id: e.target.value })}
                                            required
                                            disabled={!tournamentConfig.sub_category_id}
                                            style={{ padding: '0.75rem', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                                        >
                                            <option value="" disabled>Select Question Set (Tournament Mode)</option>
                                            {questionSets.map((qs: any) => (
                                                <option key={qs.id} value={qs.id}>{qs.name} ({qs.question_count} Qs)</option>
                                            ))}
                                        </select>
                                        {questionSets.length === 0 && tournamentConfig.sub_category_id && (
                                            <p className="help-text text-warning">No tournament question sets found for this category.</p>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Slot Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Slot-1, Evening Batches"
                                            value={tournamentConfig.slot_name}
                                            onChange={e => setTournamentConfig({ ...tournamentConfig, slot_name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Entry Fee (Coins)</label>
                                        <div className="input-with-icon">
                                            <input
                                                type="number"
                                                value={tournamentConfig.entry_coins}
                                                onChange={e => setTournamentConfig({ ...tournamentConfig, entry_coins: parseInt(e.target.value) || 0 })}
                                                min="0"
                                            />
                                            <span className="unit">Coins</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Start Time</label>
                                        <input
                                            type="datetime-local"
                                            value={tournamentConfig.start_time}
                                            onChange={e => setTournamentConfig({ ...tournamentConfig, start_time: e.target.value })}
                                            required
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>End Time</label>
                                        <input
                                            type="datetime-local"
                                            value={tournamentConfig.end_time}
                                            onChange={e => setTournamentConfig({ ...tournamentConfig, end_time: e.target.value })}
                                            required
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Max Players</label>
                                        <input
                                            type="number"
                                            value={tournamentConfig.max_players}
                                            onChange={e => setTournamentConfig({ ...tournamentConfig, max_players: parseInt(e.target.value) || 0 })}
                                            min="1"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Timer Duration</label>
                                        <div className="input-with-icon">
                                            <input
                                                type="number"
                                                value={tournamentConfig.timer_duration}
                                                onChange={e => setTournamentConfig({ ...tournamentConfig, timer_duration: parseInt(e.target.value) || 0 })}
                                                min="0"
                                            />
                                            <span className="unit">Secs</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Platform Fee (%)</label>
                                        <input
                                            type="number"
                                            value={tournamentConfig.platform_fee_percentage}
                                            onChange={e => setTournamentConfig({ ...tournamentConfig, platform_fee_percentage: parseInt(e.target.value) || 0 })}
                                            min="0"
                                            max="100"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Reward Distribution (JSON)</label>
                                        <div className="code-editor" style={{ position: 'relative' }}>
                                            <textarea
                                                value={tournamentConfig.reward_distribution}
                                                onChange={e => setTournamentConfig({ ...tournamentConfig, reward_distribution: e.target.value })}
                                                spellCheck={false}
                                                style={{
                                                    fontFamily: 'monospace',
                                                    minHeight: '120px',
                                                    background: '#1e1e1e',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '8px',
                                                    padding: '1rem',
                                                    lineHeight: 1.5
                                                }}
                                            />
                                        </div>
                                        <p className="help-text">Format: "RANK_X": Percentage. Total should ideally encompass winners.</p>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>
                                            <FileText size={16} /> Terms & Conditions Content
                                        </label>
                                        <textarea
                                            value={tournamentConfig.terms_content}
                                            onChange={e => setTournamentConfig({ ...tournamentConfig, terms_content: e.target.value })}
                                            style={{ minHeight: '200px', lineHeight: 1.6 }}
                                            placeholder="Enter detailed terms and conditions..."
                                        />
                                        <p className="help-text">This text will be displayed to users before joining the tournament.</p>
                                    </div>

                                    <div className="form-group">
                                        <label>Terms Version</label>
                                        <input
                                            type="text"
                                            value={tournamentConfig.terms_version}
                                            onChange={e => setTournamentConfig({ ...tournamentConfig, terms_version: e.target.value })}
                                            placeholder="e.g. v1.0"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ minWidth: '160px' }}>
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        {existingTournamentId ? 'Update' : 'Create'} Tournament
                                    </button>
                                </div>
                            </form>
                        )
                    ) : (
                        // Practice Mode Content
                        viewMode === 'LIST' ? (
                            <div className="animate-fadeIn">
                                <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>Practice Configurations</h3>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.7 }}>Manage per sub-category settings.</p>
                                    </div>
                                    <button
                                        className="btn-primary"
                                        onClick={handleCreateNew}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Plus size={18} />
                                        Create Configuration
                                    </button>
                                </div>

                                <div className="table-container" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Entry Fee</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Timer</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Last Updated</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {practiceConfigsList.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                        No configurations found. Create one above.
                                                    </td>
                                                </tr>
                                            ) : (
                                                practiceConfigsList.map((config) => (
                                                    <tr key={config.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <td style={{ padding: '1rem' }}>{getSubCategoryName(config.sub_category_id)}</td>
                                                        <td style={{ padding: '1rem' }}>{config.entry_coins} Coins</td>
                                                        <td style={{ padding: '1rem' }}>{config.timer_duration}s ({config.timer_enabled ? 'On' : 'Off'})</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span className={`status-badge ${config.status === 'ACTIVE' ? 'active' : 'inactive'}`} style={{
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '20px',
                                                                background: config.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                                color: config.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                                                                fontSize: '0.85rem',
                                                                fontWeight: 600
                                                            }}>
                                                                {config.status || 'ACTIVE'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
                                                            {new Date(config.updated_at || Date.now()).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                                <button
                                                                    onClick={() => handleEditConfig(config)}
                                                                    className="btn-secondary"
                                                                    title="Edit Configuration"
                                                                    style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handlePracticeSubmit} className="animate-fadeIn">
                                <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('LIST')}
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                        <div className="icon-box" style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                                            <Gamepad2 size={24} color="#10b981" />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0 }}>{existingConfigId ? 'Edit' : 'Create'} Practice Settings</h3>
                                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.7 }}>
                                                {existingConfigId ? 'Update existing rules' : 'Define new rules'} for categories.
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {(existingConfigId || configStatus) && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={() => setShowConfigModal(true)}
                                                    title="View Config JSON"
                                                    style={{ padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={() => practiceConfigs.sub_category_id && fetchPracticeConfig(practiceConfigs.sub_category_id)}
                                                    title="Refresh Config"
                                                    style={{ padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <Loader2 size={16} />
                                                </button>
                                            </>
                                        )}
                                        {existingConfigId && (
                                            <>
                                                <span className={`status-badge ${configStatus === 'ACTIVE' ? 'active' : 'inactive'}`} style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    background: configStatus === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                    color: configStatus === 'ACTIVE' ? '#10b981' : '#ef4444',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600
                                                }}>
                                                    {configStatus}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={handleStatusToggle}
                                                    className="btn-secondary"
                                                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                                                >
                                                    Toggle Status
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Sub Category</label>
                                        <select
                                            value={practiceConfigs.sub_category_id}
                                            onChange={e => setPracticeConfig({ ...practiceConfigs, sub_category_id: e.target.value })}
                                            required
                                            disabled={!!existingConfigId} // Disable category change when editing
                                            style={{ padding: '0.75rem', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                                        >
                                            <option value="" disabled>Select a category to configure</option>
                                            {allSubCategories.map(sub => (
                                                <option key={sub.id} value={sub.id}>
                                                    {sub.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Entry Fee (Coins)</label>
                                        <div className="input-with-icon">
                                            <input
                                                type="number"
                                                value={practiceConfigs.entry_coins}
                                                onChange={e => setPracticeConfig({ ...practiceConfigs, entry_coins: parseInt(e.target.value) || 0 })}
                                                min="0"
                                            />
                                            <span className="unit">Coins</span>
                                        </div>
                                        <p className="help-text">Cost to play a practice game.</p>
                                    </div>

                                    <div className="form-group">
                                        <label>Timer Duration</label>
                                        <div className="input-with-icon">
                                            <Clock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                            <input
                                                type="number"
                                                value={practiceConfigs.timer_duration}
                                                onChange={e => setPracticeConfig({ ...practiceConfigs, timer_duration: parseInt(e.target.value) || 0 })}
                                                min="0"
                                                style={{ paddingLeft: '2.5rem' }}
                                            />
                                            <span className="unit">Secs</span>
                                        </div>
                                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="checkbox"
                                                id="timerEnabled"
                                                checked={practiceConfigs.timer_enabled}
                                                onChange={e => setPracticeConfig({ ...practiceConfigs, timer_enabled: e.target.checked })}
                                            />
                                            <label htmlFor="timerEnabled" style={{ fontSize: '0.9rem', cursor: 'pointer', margin: 0 }}>Enable Timer</label>
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Refund Rules (JSON)</label>
                                        <div className="code-editor" style={{ position: 'relative' }}>
                                            <textarea
                                                value={practiceConfigs.refund_rules}
                                                onChange={e => setPracticeConfig({ ...practiceConfigs, refund_rules: e.target.value })}
                                                spellCheck={false}
                                                style={{
                                                    fontFamily: 'monospace',
                                                    minHeight: '120px',
                                                    background: '#1e1e1e',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '8px',
                                                    padding: '1rem',
                                                    lineHeight: 1.5
                                                }}
                                            />
                                        </div>
                                        <p className="help-text" style={{ marginTop: '0.5rem' }}>
                                            Format: "Percentage Score": "Refund Percentage". Example: "60": 50 means 60% score gets 50% refund.
                                        </p>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>
                                            <FileText size={16} /> Terms & Conditions Content
                                        </label>
                                        <textarea
                                            value={practiceConfigs.terms_content}
                                            onChange={e => setPracticeConfig({ ...practiceConfigs, terms_content: e.target.value })}
                                            style={{ minHeight: '200px', lineHeight: 1.6 }}
                                        />
                                        <p className="help-text">This text will be displayed to users before starting the quiz.</p>
                                    </div>

                                    <div className="form-group">
                                        <label>Terms Version</label>
                                        <input
                                            type="text"
                                            value={practiceConfigs.terms_version}
                                            onChange={e => setPracticeConfig({ ...practiceConfigs, terms_version: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-actions" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ minWidth: '160px' }}>
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        Save Configuration
                                    </button>
                                </div>
                            </form>
                        )
                    )}
                </div>
            </div>

            {/* Config View Modal */}
            {
                showConfigModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(4px)'
                    }} onClick={() => setShowConfigModal(false)}>
                        <div style={{
                            background: '#1a1a1a',
                            borderRadius: '16px',
                            width: '90%',
                            maxWidth: '600px',
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <h3 style={{ margin: 0 }}>Current Configuration JSON</h3>
                                <button
                                    onClick={() => setShowConfigModal(false)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        padding: '0.5rem'
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                                <pre style={{
                                    margin: 0,
                                    background: '#111',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    overflowX: 'auto',
                                    fontSize: '0.9rem',
                                    color: '#a5f3fc'
                                }}>
                                    {JSON.stringify({
                                        id: existingConfigId,
                                        status: configStatus,
                                        ...practiceConfigs,
                                        // Parse refund rules back to object for display if it's a string
                                        refund_rules: typeof practiceConfigs.refund_rules === 'string'
                                            ? JSON.parse(practiceConfigs.refund_rules || '{}')
                                            : practiceConfigs.refund_rules
                                    }, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Tournament Details Modal */}
            {
                selectedTournament && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(4px)'
                    }} onClick={() => setSelectedTournament(null)}>
                        <div style={{
                            background: '#1a1a1a',
                            borderRadius: '16px',
                            width: '90%',
                            maxWidth: '600px',
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden',
                            maxHeight: '80vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>Tournament Details</h3>
                                    <p style={{ margin: '0.25rem 0 0 0', opacity: 0.7, fontSize: '0.9rem' }}>{selectedTournament.slot_name}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {(selectedTournament.status === 'SCHEDULED' || selectedTournament.status === 'ACTIVE') && (
                                        <>
                                            <button
                                                onClick={() => handleEditTournament(selectedTournament)}
                                                className="btn-secondary"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                <Edit2 size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleCancelTournament(selectedTournament.id)}
                                                className="btn-secondary"
                                                style={{
                                                    color: '#ef4444',
                                                    borderColor: 'rgba(239, 68, 68, 0.3)',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                <XCircle size={16} />
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setSelectedTournament(null)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'white',
                                            cursor: 'pointer',
                                            padding: '0.5rem'
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>ID</label>
                                        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>{selectedTournament.id}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Status</label>
                                        <span className={`status-badge ${selectedTournament.status.toLowerCase()}`}>{selectedTournament.status}</span>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Category</label>
                                        <p style={{ margin: 0 }}>{getSubCategoryName(selectedTournament.sub_category_id)}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Question Set ID</label>
                                        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>{selectedTournament.question_set_id}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Start Time</label>
                                        <p style={{ margin: 0 }}>{new Date(selectedTournament.start_time).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>End Time</label>
                                        <p style={{ margin: 0 }}>{new Date(selectedTournament.end_time).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Entry Fee</label>
                                        <p style={{ margin: 0 }}>{selectedTournament.entry_coins} Coins (+{selectedTournament.platform_fee_percentage}%)</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Players</label>
                                        <p style={{ margin: 0 }}>{selectedTournament.current_players || 0} / {selectedTournament.max_players}</p>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Reward Distribution</label>
                                    <pre style={{
                                        margin: 0,
                                        background: '#111',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        overflowX: 'auto',
                                        fontSize: '0.9rem',
                                        color: '#a5f3fc'
                                    }}>
                                        {JSON.stringify(selectedTournament.reward_distribution, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default QuizConfiguration;
