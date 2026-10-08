import { CardType } from '../../../Constants.js';
import type { GameAction } from '../../../GameActions/GameAction.js';
import { discardStatusToken, dishonor, honor, joint, taint } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const ORIGINL_TOKEN = 'original';
const SELECTION = 'selection';

export default class AsakoKousuke extends DrawCard {
    static id = 'asako-kousuke';

    setupCardAbilities() {
        this.conflictAction('Treat the status token on a character as if it was another status token', { evenFromHome: true })
            .tokenTarget({
                name: ORIGINL_TOKEN,
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.glory <= context.source.glory
            })
            .selectFrom({
                name: SELECTION,
                dependsOn: ORIGINL_TOKEN
            }, (context) => {
                const targetToken = context.tokens[ORIGINL_TOKEN][0];
                const targetCard = targetToken.card;
                if(!(targetCard instanceof DrawCard)) {
                    return {};
                }

                const choices: Array<[string, GameAction]> = [];
                if(!targetCard.isHonored) {
                    choices.push([
                        'Turn it into Honored',
                        joint([
                            discardStatusToken({ target: targetToken }),
                            honor({ target: targetCard })
                        ])
                    ]);
                }

                if(!targetCard.isDishonored) {
                    choices.push([
                        'Turn it into Dishonored',
                        joint([
                            discardStatusToken({ target: targetToken }),
                            dishonor({ target: targetCard })
                        ])
                    ]);
                }

                if(!targetCard.isTainted) {
                    choices.push([
                        'Turn it into Tainted',
                        joint([
                            discardStatusToken({ target: targetToken }),
                            taint({ target: targetCard })
                        ])
                    ]);
                }

                return Object.fromEntries(choices);
            })
            .effect('clarify what it means to be {2}. The exposition reveals that {1} is {2}', (context) => [
                context.tokens[ORIGINL_TOKEN][0].card,
                context.selects.selection.choice === 'Turn it into Honored'
                    ? 'honored'
                    : context.selects.selection.choice === 'Turn it into Dishonored'
                        ? 'dishonored'
                        : 'tainted'
            ])
            .cannotTargetFirst();
    }
}
