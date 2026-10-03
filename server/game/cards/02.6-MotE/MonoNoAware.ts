import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MonoNoAware extends DrawCard {
    static id = 'mono-no-aware';

    setupCardAbilities() {
        this.action('Remove 1 fate from each character. Draw 1 card.')
            .gameAction(AbilityDsl.actions.draw(), AbilityDsl.actions.removeFate(() => ({
                target: this.game.findAnyCardsInPlay(card => card.getFate() > 0)
            })))
            .effect('remove a fate from each character and draw a card')
            .max(AbilityDsl.limit.perRound(1));
    }
}


export default MonoNoAware;
