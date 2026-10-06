import { modifyGlory } from '../../../effects.js';
import { cardLastingEffect, chooseAction } from '../../../GameActions/GameActions.js';
import { Duration } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class WolfsProposal extends DrawCard {
    static id = 'wolf-s-proposal';

    setupCardAbilities() {
        this.action('Adjust glory')
            .gameAction(chooseAction({
                options: {
                    'Increase glory': {
                        action: cardLastingEffect((context) => ({
                            target: context.source.parentCharacter ?? [],
                            duration: Duration.UntilEndOfPhase,
                            effect: modifyGlory(2)
                        }))
                    },
                    'Decrease glory': {
                        action: cardLastingEffect((context) => ({
                            target: context.source.parentCharacter ?? [],
                            duration: Duration.UntilEndOfPhase,
                            effect: modifyGlory(-2)
                        }))
                    }
                }
            }));
    }
}
