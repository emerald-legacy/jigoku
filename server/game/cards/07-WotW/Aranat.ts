import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { CardTypes, Players, TargetModes } from '../../Constants';

class Aranat extends DrawCard {
    static id = 'aranat';

    setupCardAbilities() {
        this.reaction({
            title: 'Place additional fate',
            when: {
                onCardPlayed: (event, context) => context.player.opponent && event.card === context.source
            },
            effect: 'give {1} the opportunity to reveal provinces',
            effectArgs: context => context.player.opponent,
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardTypes.Province,
                location: this.game.getProvinceArray(false),
                controller: Players.Opponent,
                player: Players.Opponent,
                optional: true,
                mode: TargetModes.Unlimited,
                cardCondition: card => card.isFacedown(),
                message: '{0} chooses to reveal {1}',
                messageArgs: (card, player) => [player, card],
                gameAction: AbilityDsl.actions.reveal()
            }),
            then: {
                message: '{3} has {4} facedown provinces so {4} fate is placed on {1}',
                messageArgs: context => [context.player.opponent, context.player.getNumberOfOpponentsFacedownProvinces()],
                thenCondition: () => true,
                gameAction: AbilityDsl.actions.placeFate(context => ({
                    target: context.source,
                    amount: context.player.getNumberOfOpponentsFacedownProvinces()
                }))
            }
        });
    }
}


export default Aranat;
