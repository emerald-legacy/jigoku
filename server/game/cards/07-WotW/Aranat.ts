import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players, TargetModes } from '../../Constants.js';

class Aranat extends DrawCard {
    static id = 'aranat';

    setupCardAbilities() {
        this.reaction({
            title: 'Place additional fate',
            when: {
                onCardPlayed: (event: any, context: any) => context.player.opponent && event.card === context.source
            },
            effect: 'give {1} the opportunity to reveal provinces',
            effectArgs: (context: any) => context.player.opponent ?? '',
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardTypes.Province,
                location: this.game.getProvinceArray(false),
                controller: Players.Opponent,
                player: Players.Opponent,
                optional: true,
                mode: TargetModes.Unlimited,
                cardCondition: (card: any) => card.isFacedown(),
                message: '{0} chooses to reveal {1}',
                messageArgs: (card: any, player: any) => [player, card],
                gameAction: AbilityDsl.actions.reveal()
            }),
            then: {
                message: '{3} has {4} facedown provinces so {4} fate is placed on {1}',
                messageArgs: (context: any) => [context.player.opponent, context.player.getNumberOfOpponentsFacedownProvinces()],
                thenCondition: () => true,
                gameAction: AbilityDsl.actions.placeFate((context: any) => ({
                    target: context.source,
                    amount: context.player.getNumberOfOpponentsFacedownProvinces()
                }))
            }
        });
    }
}


export default Aranat;
