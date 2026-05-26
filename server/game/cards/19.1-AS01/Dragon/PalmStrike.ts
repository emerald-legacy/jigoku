import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../basecard.js';
import { CardTypes, Durations, Players } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';

const TARGET_MONK = 'myMonk';
const TARGET_TO_BOW = 'characterToBow';

export default class PalmStrike extends DrawCard {
    static id = 'palm-strike';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            targets: {
                [TARGET_MONK]: {
                    activePromptTitle: 'Choose a bare-handed monk',
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (monkCharacter) =>
                        monkCharacter.isParticipating() &&
                        monkCharacter.hasTrait('monk') &&
                        this.#cardHasNoWeapons(monkCharacter)
                },
                [TARGET_TO_BOW]: {
                    dependsOn: TARGET_MONK,
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (opponentCharacter) =>
                        opponentCharacter.isParticipating() && this.#cardHasNoWeapons(opponentCharacter),
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.bow(),
                        AbilityDsl.actions.conditional({
                            condition: (context) =>
                                context.targets[TARGET_MONK] && context.targets[TARGET_MONK].hasTrait('tattooed'),
                            falseGameAction: AbilityDsl.actions.noAction(),
                            trueGameAction: AbilityDsl.actions.cardLastingEffect({
                                effect: AbilityDsl.effects.cardCannot({ cannot: 'ready' }),
                                duration: Durations.UntilEndOfConflict
                            })
                        })
                    ])
                }
            },
            effect: 'bow {1}',
            effectArgs: (context) => [context.targets[TARGET_TO_BOW]],
            then: (context) => {
                if(!context) {
                    return;
                }
                if((context.targets[TARGET_MONK] as DrawCard).hasTrait('tattooed')) {
                    context.game.addMessage(
                        '{0} cannot ready until the end of the conflict - they are overwhelmed by the mystical tattoos of {1}{2}!',
                        context.targets[TARGET_TO_BOW],
                        (context.targets[TARGET_MONK] as DrawCard).isUnique() ? '' : 'the ',
                        context.targets[TARGET_MONK]
                    );
                }
            }
        });
    }

    #cardHasNoWeapons(card: BaseCard) {
        return !card.attachments.some((attachment: BaseCard) => attachment.hasTrait('weapon'));
    }
}
