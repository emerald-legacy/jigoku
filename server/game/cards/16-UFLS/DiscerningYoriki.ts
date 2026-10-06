import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';
import { CardType, Location } from '../../Constants.js';

class DiscerningYoriki extends DrawCard {
    static id = 'discerning-yoriki';

    setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                onCardRevealed: (event, context) =>
                    event.card.location === Location.Hand && event.card.controller === context.player.opponent,
                onLookAtCards: (event, context) =>
                    event.stateBeforeResolution.some((a) => a.location === Location.Hand && a.card.controller === context.player.opponent)
            })
            .target({
                activePromptTitle: 'Choose a character to honor',
                cardType: CardType.Character
            }, honor())
            .collectiveTrigger();
    }
}


export default DiscerningYoriki;
