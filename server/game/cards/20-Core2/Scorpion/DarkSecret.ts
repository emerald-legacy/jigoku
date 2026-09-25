import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DarkSecret extends DrawCard {
    static id = 'dark-secret';

    setupCardAbilities() {
        this.reaction('Make the controller of attached character lose 1 honor')
            .when({
                onMoveFate: (event, context) =>
                    context.source.parentCharacter && context.source.parentCharacter === event.origin && event.fate > 0
            })
            .gameAction(AbilityDsl.actions.loseHonor((context) => ({
                amount: 1,
                target: this.#targetPlayer(context.source.parentCharacter)
            })))
            .effect('make {1} lose 1 honor - {2}', (context) => [this.#targetPlayer(context.source.parentCharacter), this.#quote(context.source.parentCharacter)])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }

    #targetPlayer(character: DrawCard | null) {
        return character?.controller ?? [];
    }

    #quote(character: DrawCard | null | undefined): string {
        if(!character) {
            return '';
        }
        switch(((character.printedCost ?? 0) + character.name.charCodeAt(0) + character.fate) % 7) {
            case 0:
                return 'Man is not what he thinks he is, he is what he hides';
            case 1:
                return 'What is Man? A miserable little pile of secrets';
            case 2:
                return 'I don\'t argue with my enemies; I explain to their children';
            case 3:
                return 'With a secret like that, at some point the secret itself becomes irrelevant. The fact that you kept it does not';
            case 4:
                return 'A secret\'s worth depends on the people from whom it must be kept';
            case 5:
                return 'Three may keep a secret, if two of them are dead';
            case 6:
                return 'All the secrets of the world worth knowing are hiding in plain sight';
            default:
                return '';
        }
    }
}
