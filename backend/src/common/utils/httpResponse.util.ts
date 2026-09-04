export const successResponse = ({
    message, status_code, data
}: { message: string, data?: any, status_code?: number }
) => {
    return {
        status_code: status_code ? status_code : 200,
        message: message ?? null,
        data: data ?? null
    }
}

export const errorResponse = ({
    message, status_code, data
}: { message: string, data?: any, status_code?: number }) => {
    return {
        status_code: status_code ? status_code : 400,
        message: message ?? null,
        data: data ?? null
    }
}

export const serverErrorResponse = ({
    message, status_code, data
}: { message: string, data?: any, status_code?: number }
) => {
    return {
        status_code: status_code ? status_code : 500,
        message: message ?? null,
        data: data ?? null
    }
}

/**
 * Response Formatting Helpers
 */
export const formatSuccessResponse = (data: any) => {
    return {
        success: true,
        data,
        timestamp: new Date().toISOString()
    }
}

export const formatErrorResponse = (error: any) => {
    return {
        success: false,
        error: {
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        },
        timestamp: new Date().toISOString()
    }
}