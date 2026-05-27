import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class YasukiFuzake extends DrawCard {
    static id = 'yasuki-fuzake';

    setupCardAbilities() {
        this.interrupt({
            title: 'Discard the status token on up to two characters',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            targets: {
                first: {
                    optional: true,
                    cardType: CardTypes.Character,
                    gameAction: AbilityDsl.actions.discardStatusToken(context => ({
                        target: context.targets.first.statusTokens
                    }))
                },
                second: {
                    dependsOn: 'first',
                    cardType: CardTypes.Character,
                    optional: true,
                    cardCondition: (card, context) => card.controller !== context.targets.first.controller,
                    gameAction: AbilityDsl.actions.discardStatusToken(context => ({
                        target: !Array.isArray(context.targets.second) && context.targets.second.statusTokens
                    }))
                }
            },
            effect: 'discard all status tokens from {1}{2}{3}',
            effectArgs: context => [context.targets.first, !Array.isArray(context.targets.second) ? ' and ' : '', context.targets.second]
        });
    }
}


export default YasukiFuzake;
