import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class AkodoMotivator extends DrawCard {
    static id = 'akodo-motivator';

    setupCardAbilities() {
        this.reaction({
            title: 'Opponent discards an equal number of cards at random',
            when: {
                onCardsDiscardedFromHand: (event, context) => {
                    const discardedFromOwnHand = event.player === context.player;
                    const discardedByOpponentsEffect = event.player.opponent === event.context.player;
                    const discardedByRingEffect = event.context.source.type === 'ring';
                    const discardedByCardEffect = event.context.ability.isCardAbility();
                    return (
                        discardedFromOwnHand &&
                        discardedByOpponentsEffect &&
                        (discardedByRingEffect || discardedByCardEffect)
                    );
                }
            },
            gameAction: AbilityDsl.actions.discardAtRandom((context) => ({
                amount: context.event.amount
            }))
        });
    }
}


export default AkodoMotivator;
