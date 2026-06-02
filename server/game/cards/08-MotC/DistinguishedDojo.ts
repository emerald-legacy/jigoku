import type { AbilityContext } from '../../AbilityContext.js';
import type Player from '../../Player.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventName, TargetMode, TokenType } from '../../Constants.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

class DistinguishedDojo extends DrawCard {
    static id = 'distinguished-dojo';

    setupCardAbilities() {
        this.reaction({
            title: 'Place an honor token',
            when: {
                afterDuel: (event: EventPayload<typeof EventName.AfterDuel>, context: AbilityContext) => {
                    if(!event.winningPlayer) {
                        return false;
                    }
                    if(Array.isArray(event.winningPlayer)) {
                        return event.winningPlayer.some((player: Player) => player === context.player);
                    }
                    return event.winningPlayer === context.player;
                }
            },
            limit: AbilityDsl.limit.perRound(3),
            gameAction: AbilityDsl.actions.addToken(),
            then: (context: AbilityContext) => ({
                target: {
                    mode: TargetMode.Select,
                    activePromptTitle: 'Sacrifice ' + (context?.source.name ?? '') + '?',
                    choices: {
                        'Yes': AbilityDsl.actions.sacrifice({ target: context?.source }),
                        'No': () => true
                    }
                },
                message: '{0} chooses {3}to sacrifice {1}',
                messageArgs: (context: AbilityContext) => context.select === 'No' ? 'not ' : '',
                then: (subThenContext: AbilityContext) => ({
                    gameAction: AbilityDsl.actions.gainHonor({ amount: subThenContext.source.getTokenCount(TokenType.Honor) }),
                    message: '{0} uses {1} to gain {3} honor',
                    messageArgs: [subThenContext.source.getTokenCount(TokenType.Honor)]
                })
            })
        });
    }
}


export default DistinguishedDojo;
