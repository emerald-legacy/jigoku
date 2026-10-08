import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, Players, Phase, Location, TargetMode } from '../../Constants.js';
import { conditional, lookAt, moveCard, selectCards, sequential } from '../../GameActions/GameActions.js';

class Reconnaissance extends DrawCard {
    static id = 'reconnaissance';

    setupCardAbilities() {
        this.reaction('Look at provinces')
            .when({
                onPhaseStarted: event => event.phase === Phase.Conflict
            })
            .targetCards({
                mode: TargetMode.Exactly,
                numCards: 3,
                activePromptTitle: 'Choose 3 provinces',
                location: Location.Provinces,
                cardType: CardType.Province,
                controller: Players.Any
            }, conditional({
                condition: context => !!(context.player.opponent && context.player.honor >= context.player.opponent.honor + 5),
                trueGameAction: sequential([
                    this.getLookAtAction(),
                    selectCards(context => {
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
                            message: '{0} chooses to discard {1}',
                            messageArgs: (cards) => [context.player, cards],
                            gameAction: moveCard({ destination: Location.DynastyDiscardPile })
                        });
                    })
                ]),
                falseGameAction: this.getLookAtAction()
            }))
            .chatText('look at 3 provinces');
    }

    getLookAtAction() {
        return lookAt(context => ({
            message: context => {
                let target: BaseCard | BaseCard[] | undefined = context.targets.target;
                if(!Array.isArray(target)) {
                    target = target ? [target] : [];
                }

                if(target.length === 1) {
                    return '{0} sees {1} in {2}';
                } else if(target.length === 2) {
                    return '{0} sees {1} in {2} and {3} in {4}';
                }
                return '{0} sees {1} in {2}, {3} in {4}, and {5} in {6}';

            },
            messageArgs: () => {
                let target: BaseCard | BaseCard[] | undefined = context.targets.target;
                if(!Array.isArray(target)) {
                    target = target ? [target] : [];
                }

                if(target.length === 1) {
                    return [context.source, target[0], target[0].location];
                } else if(target.length === 2) {
                    return [context.source, target[0], target[0].location, target[1], target[1].location];
                }
                return [context.source, target[0], target[0].location, target[1], target[1].location, target[2], target[2].location];

            }
        }));
    }
}


export default Reconnaissance;
