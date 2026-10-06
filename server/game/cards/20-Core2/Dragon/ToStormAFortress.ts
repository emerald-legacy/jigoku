import { CardType, Players, ConflictType } from '../../../Constants.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, discardCard, menuPrompt, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ToStormAFortress extends DrawCard {
    static id = 'to-storm-a-fortress';

    public setupCardAbilities() {
        this.conflictAction('Increase a character\'s military skill', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasSomeTrait('bushi', 'monk')
            }, sequential([
                cardLastingEffect({
                    effect: modifyMilitarySkill(2)
                }),
                menuPrompt((context) => ({
                    activePromptTitle: 'Discard each card in the attacked province?',
                    choices: ['Yes', 'No'],
                    choiceHandler: (choice, displayMessage) => {
                        const cardsToDiscard = context.game.requireConflict()
                            .getConflictProvinces()
                            .flatMap((province) =>
                                province.controller.getDynastyCardsInProvince(province.location)
                            );

                        if(displayMessage && choice === 'Yes') {
                            context.game.addMessage(
                                '{0}\'s {1} discards {2}',
                                context.player,
                                context.source,
                                cardsToDiscard
                            );
                        }
                        return { target: choice === 'Yes' ? cardsToDiscard : [] };
                    },
                    gameAction: discardCard()
                }))
            ]))
            .effect('grant +2{1} to {0}', () => ['military']);
    }
}
