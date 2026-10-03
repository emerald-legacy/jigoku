import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';

class DiscerningYoriki extends DrawCard {
    static id = 'discerning-yoriki';

    setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                onCardRevealed: (event, context) => {
                    const cards = Array.isArray(event.card) ? event.card : [event.card];
                    return cards.some((a) => a.location === Location.Hand && a.controller === context.player.opponent);
                },
                onLookAtCards: (event, context) => {
                    const raw = event.stateBeforeResolution;
                    const cards = Array.isArray(raw) ? raw : [raw];
                    return cards.some((a) => a?.location === Location.Hand && a?.card?.controller === context.player.opponent);
                }
            })
            .target('target', {
                activePromptTitle: 'Choose a character to honor',
                cardType: CardType.Character
            }, AbilityDsl.actions.honor())
            .collectiveTrigger();
    }
}


export default DiscerningYoriki;
