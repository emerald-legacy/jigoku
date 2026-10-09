import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, Players, Phase, Location, TargetMode } from '../../Constants.js';
import { conditional, lookAt, moveCard, selectCards, sequential } from '../../GameActions/GameActions.js';

class Reconnaissance extends DrawCard {
    static id = 'reconnaissance';

    setupCardAbilities() {
        this.reaction('Look at provinces')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Conflict
            })
            .targetCards({
                mode: TargetMode.Exactly,
                numCards: 3,
                activePromptTitle: 'Choose 3 provinces',
                location: Location.Provinces,
                cardType: CardType.Province,
                controller: Players.Any
            }, conditional({
                condition: (context) => !!(context.player.opponent && context.player.honor >= context.player.opponent.honor + 5),
                trueGameAction: sequential([
                    this.getLookAtAction(),
                    selectCards((context) => {
                        let target: BaseCard | BaseCard[] | undefined = context.targets.target;
                        if(!Array.isArray(target)) {
                            target = target ? [target] : [];
                        }
                        const locations = target.map((a) => a.location);
                        return ({
                            activePromptTitle: 'Choose cards to discard',
                            mode: TargetMode.Unlimited,
                            optional: true,
                            cardType: [CardType.Character, CardType.Event, CardType.Holding],
                            location: [Location.Provinces],
                            controller: Players.Any,
                            cardCondition: (card) => locations.includes(card.location),
                            message: (_context, cards) => msg`${context.player} chooses to discard ${cards}`,
                            gameAction: moveCard({ destination: Location.DynastyDiscardPile })
                        });
                    })
                ]),
                falseGameAction: this.getLookAtAction()
            }))
            .chatText('look at 3 provinces');
    }

    getLookAtAction() {
        return lookAt({
            message: (context) => {
                const target: BaseCard | BaseCard[] | undefined = context.targets.target;
                const provinces = Array.isArray(target) ? target : target ? [target] : [];
                const [first, second, third] = provinces;
                if(provinces.length === 1) {
                    return msg`${context.source} sees ${first} in ${first.location}`;
                } else if(provinces.length === 2) {
                    return msg`${context.source} sees ${first} in ${first.location} and ${second} in ${second.location}`;
                }
                return msg`${context.source} sees ${first} in ${first.location}, ${second} in ${second.location}, and ${third} in ${third.location}`;
            }
        });
    }
}


export default Reconnaissance;
