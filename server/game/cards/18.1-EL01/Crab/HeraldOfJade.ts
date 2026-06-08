import DrawCard from '../../../DrawCard.js';
import { TargetMode, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { StatusToken } from '../../../StatusToken.js';

class HeraldOfJade extends DrawCard {
    static id = 'herald-of-jade';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard a status token and gain 1 honor',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                mode: TargetMode.Token,
                location: Location.Any,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.discardStatusToken(),
                    AbilityDsl.actions.gainHonor(context => ({
                        target: context.player,
                        amount: 1
                    }))
                ])
            },
            effect: 'discard {1}\'s {2} and gain 1 honor',
            effectArgs: context => [
                (context.token as StatusToken[])?.[0]?.card,
                context.token
            ]
        });
    }
}


export default HeraldOfJade;
