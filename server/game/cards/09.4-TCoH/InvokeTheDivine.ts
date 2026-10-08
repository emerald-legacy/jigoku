import DrawCard from '../../DrawCard.js';
import { playCard, selectCard } from '../../GameActions/GameActions.js';

import { Location, Players } from '../../Constants.js';

class InvokeTheDivine extends DrawCard {
    static id = 'invoke-the-divine';

    setupCardAbilities() {
        const getSelectCardAction = (fate: number, spellsCast: number) => selectCard({
            location: Location.Hand,
            controller: Players.Self,
            cardCondition: (card) => card.isDrawCard() && card.hasTrait('spell') && (card.getCost() ?? 0) <= fate,
            optional: spellsCast > 0,
            gameAction: playCard(invokeContext => ({
                resetOnCancel: true,
                payCosts: false,
                source: this,
                postHandler: (context) => {
                    if(spellsCast < 2) {
                        getSelectCardAction(fate - ((context.source.isDrawCard() ? context.source.getCost() : null) ?? 0), spellsCast + 1).resolve(undefined, invokeContext);
                    }
                }
            }))
        });
        this.action('Play 3 spells')
            .gameAction(getSelectCardAction(5, 0))
            .chatText('play 3 spells from their hand');
    }
}


export default InvokeTheDivine;

