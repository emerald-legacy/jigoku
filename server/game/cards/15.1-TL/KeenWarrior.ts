import DrawCard from '../../DrawCard.js';
import BaseCard from '../../BaseCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations } from '../../Constants.js';

class KeenWarrior extends DrawCard {
    static id = 'keen-warrior';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw 2 cards and return 1',
            collectiveTrigger: true,
            when: {
                onCardRevealed: (event, context) => {
                    const raw = event.card as BaseCard | BaseCard[];
                    const cards = Array.isArray(raw) ? raw : [raw];
                    return cards.some((a: BaseCard) => a.location === Locations.Hand && a.controller === context.player.opponent);
                },
                onLookAtCards: (event, context) => {
                    const raw = (event as unknown as { stateBeforeResolution?: { card: BaseCard; location: Locations }[] }).stateBeforeResolution;
                    const cards = Array.isArray(raw) ? raw : raw ? [raw] : [];
                    return cards.some((a) => a.location === Locations.Hand && a.card.controller === context.player.opponent);
                }
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.draw(context => ({ target: context.player, amount: 2 })),
                AbilityDsl.actions.chosenReturnToDeck(context => ({
                    target: context.player,
                    targets: false,
                    shuffle: false,
                    bottom: true,
                    amount: 1
                }))
            ]),
            effect: 'draw 2 cards, then place a card on the bottom of their deck'
        });
    }
}


export default KeenWarrior;
