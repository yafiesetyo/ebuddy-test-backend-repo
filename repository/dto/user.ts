export type UserDto = {
    id: string,
    name: string,
    username: string,
    password: string,
}

export function ToUserDto(
    id: string,
    name: string,
    username: string,
    password: string
) :UserDto {
    const data: UserDto = {
        id,
        name,
        username,
        password,
    }

    return data
}