/** The indefinite article for `name`: 'an' before a vowel, otherwise 'a'. */
export function article(name: string): 'a' | 'an' {
    return /^[aieouAIEOU]/.test(name) ? 'an' : 'a';
}
