import { msg } from '../../../GameChat.js';
import { CardType, CharacterStatus } from '../../../Constants.js';
import type { GameAction } from '../../../GameActions/GameAction.js';
import { discardStatusToken, gainStatusToken, joint } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const ORIGINAL_TOKEN = 'original';
const SELECTION = 'selection';

export default class AsakoKousuke extends DrawCard {
    static id = 'asako-kousuke';

    override setupCardAbilities() {
        this.conflictAction('Treat the status token on a character as if it was another status token', { evenFromHome: true })
            .tokenTarget({
                name: ORIGINAL_TOKEN,
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.glory <= context.source.glory
            })
            .selectFrom({
                name: SELECTION,
                dependsOn: ORIGINAL_TOKEN
            }, (context) => {
                const targetToken = context.tokens[ORIGINAL_TOKEN][0];
                const targetCard = targetToken.card;
                if(!targetCard?.isDrawCard()) {
                    return {};
                }

                const canReceive = (token: CharacterStatus) => gainStatusToken({ token }).canAffect(targetCard, context);
                const choices: Array<[string, GameAction]> = [];
                if(canReceive(CharacterStatus.Honored)) {
                    choices.push([
                        'Turn it into Honored',
                        joint([
                            discardStatusToken({ target: targetToken }),
                            gainStatusToken({ target: targetCard, token: CharacterStatus.Honored })
                        ])
                    ]);
                }

                if(canReceive(CharacterStatus.Dishonored)) {
                    choices.push([
                        'Turn it into Dishonored',
                        joint([
                            discardStatusToken({ target: targetToken }),
                            gainStatusToken({ target: targetCard, token: CharacterStatus.Dishonored })
                        ])
                    ]);
                }

                if(canReceive(CharacterStatus.Tainted)) {
                    choices.push([
                        'Turn it into Tainted',
                        joint([
                            discardStatusToken({ target: targetToken }),
                            gainStatusToken({ target: targetCard, token: CharacterStatus.Tainted })
                        ])
                    ]);
                }

                return Object.fromEntries(choices);
            })
            .chatText((context) => {
                const choice = context.selects.selection.choice;
                const status = choice === 'Turn it into Honored' ? 'honored' : choice === 'Turn it into Dishonored' ? 'dishonored' : 'tainted';
                return msg`clarify what it means to be ${status}. The exposition reveals that ${context.tokens[ORIGINAL_TOKEN][0].card} is ${status}`;
            })
            .cannotTargetFirst();
    }
}
