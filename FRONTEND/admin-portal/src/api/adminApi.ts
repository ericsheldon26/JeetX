import axios from 'axios';

const BASE_URL = '/admin-api';

const adminApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token and log requests
adminApi.interceptors.request.use((config) => {
    let token = localStorage.getItem('adminToken');

    // Safety check: if token is literal string "undefined" or "null", clear it
    if (token === 'undefined' || token === 'null') {
        localStorage.removeItem('adminToken');
        token = null;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🔑 Headers:`, {
        ...config.headers,
        Authorization: token ? `Bearer ${token.substring(0, 15)}...` : 'NONE'
    });
    console.log('📦 Payload (Data):', config.data || 'No data');
    console.log('🔍 Query Params:', config.params || 'No params');
    console.groupEnd();

    return config;
});

// Add a response interceptor to log responses and errors
adminApi.interceptors.response.use(
    (response) => {
        console.group(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
        console.log('📊 Data:', response.data);
        console.groupEnd();
        return response;
    },
    (error) => {
        console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);

        // Handle session expiration (Unauthorized)
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login?error=Session expired. Please login again.';
            }
        }

        // Handle Forbidden (logged in but no permission for this specific action)
        if (error.response?.status === 403) {
            console.warn('⛔ Access Denied: You do not have permission for this action.');
            // We don't log them out here, just let the component handle the error
        }

        return Promise.reject(error);
    }
);

export const authApi = {
    register: (data: any) => adminApi.post('/admin/api/v1/auth/register', data),
    login: (data: any) => adminApi.post('/admin/api/v1/auth/login', data),
    getAdmins: () => adminApi.get('/admin/api/v1/auth/admins'),
    updatePermissions: (id: string, permissions: any) => adminApi.put(`/admin/api/v1/auth/admins/${id}/permissions`, { permissions }),
    deactivateAdmin: (id: string) => adminApi.delete(`/admin/api/v1/auth/admins/${id}`),
};

export const notificationApi = {
    createCampaign: (data: {
        title: string;
        message: string;
        category: 'SYSTEM' | 'GAME' | 'OFFER' | 'REMINDER' | 'INFO';
        target_type: 'ALL' | 'SEGMENT' | 'CUSTOM' | 'SINGLE';
        target_segment?: string;
        target_user_ids?: string[];
        screen_redirect?: string;
        data?: any;
        schedule_at?: string;
    }) => adminApi.post('/admin/api/v1/notifications', data),

    sendTestNotification: (data: {
        user_id: string;
        title: string;
        message: string;
        category?: 'SYSTEM' | 'GAME' | 'OFFER' | 'REMINDER' | 'INFO';
    }) => adminApi.post('/admin/api/v1/notifications/send-test', data),

    getCampaigns: (params?: { limit?: number; offset?: number }) =>
        adminApi.get('/admin/api/v1/notifications', { params }),

    getCampaignDetail: (id: string) =>
        adminApi.get(`/admin/api/v1/notifications/${id}`),

    cancelCampaign: (id: string) =>
        adminApi.put(`/admin/api/v1/notifications/${id}/cancel`),
};

export const quizApi = {
    getCategories: () => adminApi.get('/admin/api/v1/quiz/categories'),
    createCategory: (data: {
        name: string;
        description?: string;
        icon_url?: string;
        display_order?: number;
    }) => adminApi.post('/admin/api/v1/quiz/categories', data),
    getCategory: (id: string) => adminApi.get(`/admin/api/v1/quiz/categories/${id}`),
    createQuestion: (data: {
        sub_category_id: string;
        question_text: string;
        option_a: string;
        option_b: string;
        option_c: string;
        option_d: string;
        correct_option: 'A' | 'B' | 'C' | 'D';
        difficulty: 'EASY' | 'MEDIUM' | 'HARD';
        attachment?: File;
    }) => {
        const formData = new FormData();
        formData.append('sub_category_id', data.sub_category_id);
        formData.append('question_text', data.question_text);
        formData.append('option_a', data.option_a);
        formData.append('option_b', data.option_b);
        formData.append('option_c', data.option_c);
        formData.append('option_d', data.option_d);
        formData.append('correct_option', data.correct_option);
        formData.append('difficulty', data.difficulty);
        if (data.attachment) {
            formData.append('attachment', data.attachment);
        }
        return adminApi.post('/admin/api/v1/quiz/questions', formData, {
            headers: {
                'Content-Type': undefined, // Let browser set multipart/form-data with boundary
            } as any, // Cast to avoid TS error if strict types don't allow undefined
        });
    },
    listQuestions: (params?: {
        sub_category_id?: string;
        difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
        status?: 'ACTIVE' | 'INACTIVE';
        limit?: number;
        offset?: number;
    }) => adminApi.get('/admin/api/v1/quiz/questions', { params }),
    getQuestionDetail: (id: string) => adminApi.get(`/admin/api/v1/quiz/questions/${id}`),
    updateQuestion: (id: string, data: any) => {
        const formData = new FormData();
        // Append all standard fields
        if (data.sub_category_id) formData.append('sub_category_id', data.sub_category_id);
        if (data.question_text) formData.append('question_text', data.question_text);
        if (data.option_a) formData.append('option_a', data.option_a);
        if (data.option_b) formData.append('option_b', data.option_b);
        if (data.option_c) formData.append('option_c', data.option_c);
        if (data.option_d) formData.append('option_d', data.option_d);
        if (data.correct_option) formData.append('correct_option', data.correct_option);
        if (data.difficulty) formData.append('difficulty', data.difficulty);

        // Handle attachment specifically
        if (data.attachment) {
            formData.append('attachment', data.attachment);
        }

        return adminApi.put(`/admin/api/v1/quiz/questions/${id}`, formData, {
            headers: {
                'Content-Type': undefined,
            } as any,
        });
    },
    updateQuestionStatus: (id: string, status: 'ACTIVE' | 'INACTIVE') =>
        adminApi.put(`/admin/api/v1/quiz/questions/${id}/status`, { status }),
    getQuestionStats: (sub_category_id?: string) => {
        const params = sub_category_id ? { sub_category_id } : {};
        return adminApi.get('/admin/api/v1/quiz/questions/stats', { params });
    },
    getCategoryStats: () => adminApi.get('/admin/api/v1/quiz/categories/stats'),
    bulkUploadQuestions: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return adminApi.post('/admin/api/v1/quiz/questions/bulk', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    createQuestionSet: (data: any) => adminApi.post('/admin/api/v1/quiz/question-sets', data),
    listQuestionSets: (params?: {
        sub_category_id?: string;
        mode?: 'TOURNAMENT' | 'PRACTICE';
        limit?: number;
        offset?: number;
    }) => adminApi.get('/admin/api/v1/quiz/question-sets', { params }),
    getQuestionSetDetail: (id: string) => adminApi.get(`/admin/api/v1/quiz/question-sets/${id}`),
    updateQuestionSet: (id: string, data: any) => adminApi.put(`/admin/api/v1/quiz/question-sets/${id}`, data),
    deleteQuestionSet: (id: string) => adminApi.delete(`/admin/api/v1/quiz/question-sets/${id}`),
    updateQuestionSetStatus: (id: string, status: 'ACTIVE' | 'INACTIVE') =>
        adminApi.put(`/admin/api/v1/quiz/question-sets/${id}/status`, { status }),
    getPracticeConfig: (sub_category_id?: string) =>
        adminApi.get('/admin/api/v1/quiz/practice-config', { params: { sub_category_id } }),
    createPracticeConfig: (data: any) => adminApi.post('/admin/api/v1/quiz/practice-config', data),
    updatePracticeConfig: (id: string, data: any) => adminApi.put(`/admin/api/v1/quiz/practice-config/${id}`, data),
    updatePracticeConfigStatus: (id: string, status: 'ACTIVE' | 'INACTIVE') =>
        adminApi.put(`/admin/api/v1/quiz/practice-config/${id}/status`, { status }),
    createTournament: (data: any) => adminApi.post('/admin/api/v1/quiz/tournaments', data),
    listTournaments: (params?: {
        sub_category_id?: string;
        status?: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
        limit?: number;
        offset?: number;
    }) => adminApi.get('/admin/api/v1/quiz/tournaments', { params }),
    getTournamentStats: () => adminApi.get('/admin/api/v1/quiz/tournaments/stats'),
    getTournamentDetail: (id: string) => adminApi.get(`/admin/api/v1/quiz/tournaments/${id}`),
    cancelTournament: (id: string) => adminApi.put(`/admin/api/v1/quiz/tournaments/${id}/cancel`),
    updateTournament: (id: string, data: any) => adminApi.put(`/admin/api/v1/quiz/tournaments/${id}`, data),
};

export default adminApi;
