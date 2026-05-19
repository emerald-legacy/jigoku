import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes } from '../../Constants.js';

class DiscerningYoriki extends DrawCard {
    static id = 'discerning-yoriki';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character',
            collectiveTrigger: true,
            when: {
                onCardRevealed: (event, context) => {
                    let cards = event.card;
                    if(!Array.isArray(cards)) {
                        cards = [cards];
                    }

                    return cards.some(a => a.location === Locations.Hand && a.controller === context.player.opponent);
                },
                onLookAtCards: (event, context) => {
                    let cards = event.stateBeforeResolution;
                    if(!Array.isArray(cards)) {
                        cards = [cards];
                    }

                    return cards.some(a => a.location === Locations.Hand && a.card.controller === context.player.opponent);
                }
            },
            target: {
                activePromptTitle: 'Choose a character to honor',
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}


export default DiscerningYoriki;
