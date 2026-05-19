import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetModes, TokenTypes } from '../../Constants.js';

class DistinguishedDojo extends DrawCard {
    static id = 'distinguished-dojo';

    setupCardAbilities() {
        this.reaction({
            title: 'Place an honor token',
            when: {
                afterDuel: (event, context) => {
                    if(!event.winningPlayer) {
                        return false;
                    }
                    if(Array.isArray(event.winningPlayer)) {
                        return event.winningPlayer.some(player => player === context.player);
                    }
                    return event.winningPlayer === context.player;
                }
            },
            limit: AbilityDsl.limit.perRound(3),
            gameAction: AbilityDsl.actions.addToken(),
            then: context => ({
                target: {
                    mode: TargetModes.Select,
                    activePromptTitle: 'Sacrifice ' + context.source.name + '?',
                    choices: {
                        'Yes': AbilityDsl.actions.sacrifice({ target: context.source }),
                        'No': () => true
                    }
                },
                message: '{0} chooses {3}to sacrifice {1}',
                messageArgs: context => context.select === 'No' ? 'not ' : '',
                then: subThenContext => ({
                    gameAction: AbilityDsl.actions.gainHonor({ amount: subThenContext.source.getTokenCount(TokenTypes.Honor) }),
                    message: '{0} uses {1} to gain {3} honor',
                    messageArgs: [subThenContext.source.getTokenCount(TokenTypes.Honor)]
                })
            })
        });
    }
}


export default DistinguishedDojo;
