import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, PlayType} from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WarmWelcome extends DrawCard {
    static id = 'warm-welcome';

    setupCardAbilities() {
        this.action({
            title: 'Play a conflict card from discard',
            condition: context => !!(context.player.opponent && context.player.showBid < context.player.opponent.showBid),
            target: {
                location: Location.ConflictDiscardPile,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.playCard(context => ({
                        source: this,
                        target: context.target,
                        playType: PlayType.PlayFromHand
                    })),
                    AbilityDsl.actions.moveCard(context => ({
                        target: context.target.type === CardType.Event ? context.target : [],
                        destination: Location.ConflictDeck, bottom: true
                    }))
                ])
            }
        });
    }
}


export default WarmWelcome;
