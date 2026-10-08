import { cardCannot } from '../../../effects.js';
import { bow, cardLastingEffect, conditional, multiple } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

const TARGET_MONK = 'myMonk';
const TARGET_TO_BOW = 'characterToBow';

export default class PalmStrike extends DrawCard {
    static id = 'palm-strike';

    setupCardAbilities() {
        this.action('Bow a character')
            .target({
                name: TARGET_MONK,
                activePromptTitle: 'Choose a bare-handed monk',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (monkCharacter) =>
                    monkCharacter.isParticipating() &&
                        monkCharacter.hasTrait('monk') &&
                        this.cardHasNoWeapons(monkCharacter)
            })
            .target({
                name: TARGET_TO_BOW,
                dependsOn: TARGET_MONK,
                activePromptTitle: 'Choose a character to bow',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (opponentCharacter) =>
                    opponentCharacter.isParticipating() && this.cardHasNoWeapons(opponentCharacter)
            }, multiple([
                bow(),
                conditional({
                    condition: (context) => {
                        const monk = context.targets[TARGET_MONK];
                        return !Array.isArray(monk) && !!monk?.hasTrait('tattooed');
                    },
                    trueGameAction: cardLastingEffect({
                        effect: cardCannot({ cannot: 'ready' })
                    })
                })
            ]))
            .chatText((context) => msg`bow ${context.targets[TARGET_TO_BOW]}`)
            .onResolve((context) => {
                if(context.targets[TARGET_MONK].hasTrait('tattooed')) {
                    context.game.addMessage(msg`${context.targets[TARGET_TO_BOW]} cannot ready until the end of the conflict - they are overwhelmed by the mystical tattoos of ${context.targets[TARGET_MONK].isUnique() ? '' : 'the '}${context.targets[TARGET_MONK]}`);
                }
            });
    }

    private cardHasNoWeapons(card: BaseCard) {
        return !card.attachments.some((attachment) => attachment.hasTrait('weapon'));
    }
}
