import { modifyGlory } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { Duration } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class WolfsProposal extends DrawCard {
    static id = 'wolf-s-proposal';

    override setupCardAbilities() {
        this.action('Adjust glory')
            .chooseAction({
                choices: {
                    'Increase glory': {
                        action: cardLastingEffect((context) => ({
                            target: context.source.parentCharacter ?? [],
                            duration: Duration.UntilEndOfPhase,
                            effect: modifyGlory(2)
                        })),
                        message: (context, _target, chooser) => msg`${chooser} increases ${context.source.parentCharacter}'s glory by 2 for this phase`
                    },
                    'Decrease glory': {
                        action: cardLastingEffect((context) => ({
                            target: context.source.parentCharacter ?? [],
                            duration: Duration.UntilEndOfPhase,
                            effect: modifyGlory(-2)
                        })),
                        message: (context, _target, chooser) => msg`${chooser} decreases ${context.source.parentCharacter}'s glory by 2 for this phase`
                    }
                }
            });
    }
}
