import CardAbility from '../../CardAbility.js';
import { CardType, EventName } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { DuelsThisConflict } from '../DuelsThisConflict.js';

export default class StoriedDefeat extends DrawCard {
    static id = 'storied-defeat';

    public setupCardAbilities() {
        const duelLosers = DuelsThisConflict.losers(this.game, { forgetOnEnterPlay: true });
        this.conflictAction('Bow a character who lost a duel')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => duelLosers.has(card)
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.bow(),
                AbilityDsl.actions.menuPrompt((context) => ({
                    activePromptTitle: 'Spend 1 fate to dishonor ' + context.target.name + '?',
                    choices: ['Yes'].concat(
                        context.events.some((event) => event.name === EventName.OnCardBowed) ? ['No'] : []
                    ),
                    choiceHandler: (choice, displayMessage) => {
                        if(displayMessage) {
                            context.game.addMessage(
                                '{0} chooses {1}to spend a fate to dishonor {2}',
                                context.player,
                                choice === 'No' ? 'not ' : '',
                                context.target
                            );
                        }
                        return { amount: choice === 'Yes' ? 1 : 0 };
                    },
                    gameAction: AbilityDsl.actions.joint([
                        AbilityDsl.actions.loseFate({ target: context.player }),
                        AbilityDsl.actions.resolveAbility({
                            target: context.source,
                            subResolution: true,
                            ability: new CardAbility(context.source, {
                                title: 'Dishonor this character',
                                gameAction: AbilityDsl.actions.dishonor({ target: context.target })
                            })
                        })
                    ])
                }))
            ]));
    }
}
