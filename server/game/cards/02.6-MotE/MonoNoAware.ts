import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class MonoNoAware extends DrawCard {
    static id = 'mono-no-aware';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Remove 1 fate from each character. Draw 1 card.',
            effect: 'remove a fate from each character and draw a card',
            gameAction: [
                ability.actions.draw(),
                ability.actions.removeFate(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getFate() > 0)
                }))
            ],
            max: ability.limit.perRound(1)
        });
    }
}


export default MonoNoAware;
