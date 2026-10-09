import { msg } from '../../GameChat.js';
import { GameMode } from '../../../GameMode.js';
import { CardType, TargetMode, DeckType, Location, Players } from '../../Constants.js';
import { hideWhenFaceUp } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class KaiuShihobu extends DrawCard {
    static id = 'kaiu-shihobu';

    setupCardAbilities() {
        this.reaction('Look at your dynasty deck')
            .when({
                onCharacterEntersPlay: (event, context) =>
                    event.card === context.source && context.game.rules.name !== GameMode.Skirmish
            })
            .deckSearch({
                cardCondition: (card) => card.type === CardType.Holding,
                mode: TargetMode.Unlimited,
                deck: DeckType.Dynasty,
                selectedCardsHandler: (_context, event, cards) => {
                    if(cards.length > 0) {
                        this.game.addMessage(msg`${event.player} selects ${cards}`);
                        cards.forEach((card) => {
                            event.player.stronghold?.addChildCard(card, Location.UnderneathStronghold);
                            event.player.moveCard(card, Location.UnderneathStronghold);
                            card.lastingEffect({
                                until: {
                                    onCardMoved: (event) =>
                                        event.card === card && event.originalLocation === Location.UnderneathStronghold
                                },
                                match: card,
                                effect: [hideWhenFaceUp()]
                            });
                        });
                    } else {
                        this.game.addMessage(msg`${event.player} selects no holdings`);
                    }
                }
            });

        this.action('Put a holding in a province')
            .condition((context) => context.game.rules.name !== GameMode.Skirmish)
            .target({
                name: 'first',
                activePromptTitle: 'Choose a holding',
                cardType: CardType.Holding,
                controller: Players.Self,
                location: Location.UnderneathStronghold,
                cardCondition: (card, context) => !!context.player.stronghold && context.player.stronghold.childCards.includes(card)
            })
            .target({
                name: 'second',
                activePromptTitle: 'Choose an unbroken province',
                dependsOn: 'first',
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.location !== Location.StrongholdProvince && !card.isBroken
            })
            .handler((context) => {
                const holding = context.targets.first;
                const province = context.targets.second;

                const cards = context.player.getDynastyCardsInProvince(province.location);
                if(context.player.stronghold) {
                    context.player.stronghold.removeChildCard(holding, province.location);
                }
                holding.facedown = false;
                cards.forEach((card) => {
                    context.player.moveCard(card, Location.DynastyDiscardPile);
                });
            })
            .chatText((context) => msg`discard ${context.player.getDynastyCardsInProvince(context.targets.second.location)}, replacing ${context.player.getDynastyCardsInProvince(context.targets.second.location).length > 1 ? 'them' : 'it'} with ${context.targets.first}`);
    }
}
