import DrawCard from '../../drawcard.js';
import { Locations, Players, CardTypes, PlayTypes} from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WarmWelcome extends DrawCard {
    static id = 'warm-welcome';

    setupCardAbilities() {
        this.action({
            title: 'Play a conflict card from discard',
            condition: context => !!(context.player.opponent && context.player.showBid < context.player.opponent.showBid),
            target: {
                location: Locations.ConflictDiscardPile,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.playCard(context => ({
                        source: this,
                        target: context.target,
                        playType: PlayTypes.PlayFromHand
                    })),
                    AbilityDsl.actions.moveCard(context => ({
                        target: context.target.type === CardTypes.Event ? context.target : [],
                        destination: Locations.ConflictDeck, bottom: true
                    }))
                ])
            }
        });
    }
}


export default WarmWelcome;
