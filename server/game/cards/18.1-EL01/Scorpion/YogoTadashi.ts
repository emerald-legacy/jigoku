import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Players } from '../../../Constants.js';

class YogoTadashi extends DrawCard {
    static id = 'yogo-tadashi';

    setupCardAbilities() {
        this.reaction({
            title: 'Prevent a character from being targeted by events',
            when: {
                onConflictDeclared: (event, context) => event.attackers?.includes(context.source) ?? false,
                onDefendersDeclared: (event, context) => event.defenders?.includes(context.source) ?? false,
                onMoveToConflict: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.target,
                    effect: AbilityDsl.effects.cardCannot({
                        cannot: 'target',
                        restricts: 'opponentsEvents'
                    })
                }))
            },
            effect: 'prevent {0} from being targeted by events played by {1}',
            effectArgs: context => [context.player.opponent].filter((p): p is NonNullable<typeof p> => p !== undefined)
        });
    }
}

export default YogoTadashi;
