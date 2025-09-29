export function formatResponse<T>(data: T, message = 'Thành công', success = true) {
    return {
        success,
        message,
        data,
    };
}