export function article(name: string): 'a' | 'an' {
    return /^[aieouAIEOU]/.test(name) ? 'an' : 'a';
}
