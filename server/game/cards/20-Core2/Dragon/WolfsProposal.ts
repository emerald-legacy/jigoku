import AbilityDsl from '../../../abilitydsl.js';
import { Duration } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class WolfsProposal extends DrawCard {
    static id = 'wolf-s-proposal';

    setupCardAbilities() {
        this.action({
            title: 'Adjust glory',
            gameAction: AbilityDsl.actions.chooseAction({
                options: {
                    'Increase glory': {
                        action: AbilityDsl.actions.cardLastingEffect((context) => ({
                            target: context.source.parent,
                            duration: Duration.UntilEndOfPhase,
                            effect: AbilityDsl.effects.modifyGlory(2)
                        }))
                    },
                    'Decrease glory': {
                        action: AbilityDsl.actions.cardLastingEffect((context) => ({
                            target: context.source.parent,
                            duration: Duration.UntilEndOfPhase,
                            effect: AbilityDsl.effects.modifyGlory(-2)
                        }))
                    }
                }
            })
        });
    }
}
