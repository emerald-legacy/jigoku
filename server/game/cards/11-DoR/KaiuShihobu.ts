import { GameModes } from '../../../GameModes.js';
import { CardType, EventName, TargetMode, Decks, Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import type Player from '../../Player.js';
import type { ProvinceCard } from '../../ProvinceCard.js';

export default class KaiuShihobu extends DrawCard {
    static id = 'kaiu-shihobu';

    setupCardAbilities() {
        this.reaction({
            title: 'Look at your dynasty deck',
            when: {
                onCharacterEntersPlay: (event, context) =>
                    event.card === context.source && context.game.gameMode !== GameModes.Skirmish
            },
            gameAction: AbilityDsl.actions.deckSearch({
                cardCondition: (card) => card.type === CardType.Holding,
                targetMode: TargetMode.Unlimited,
                deck: Decks.DynastyDeck,
                selectedCardsHandler: (context, event, cards) => {
                    const searchEvent = event as GameEvent<EventName.OnDeckSearch> & { player: Player };
                    if(cards.length > 0) {
                        this.game.addMessage('{0} selects {1}', searchEvent.player, cards);
                        cards.forEach((card) => {
                            searchEvent.player.stronghold?.addChildCard(card, Location.UnderneathStronghold);
                            searchEvent.player.moveCard(card, Location.UnderneathStronghold);
                            card.lastingEffect(() => ({
                                until: {
                                    onCardMoved: (event: any) =>
                                        event.card === card && event.originalLocation === Location.UnderneathStronghold
                                },
                                match: card,
                                effect: [AbilityDsl.effects.hideWhenFaceUp()]
                            }));
                        });
                    } else {
                        this.game.addMessage('{0} selects no holdings', searchEvent.player);
                    }
                }
            })
        });

        this.action({
            title: 'Put a holding in a province',
            condition: (context) => context.game.gameMode !== GameModes.Skirmish,
            targets: {
                first: {
                    activePromptTitle: 'Choose a holding',
                    cardType: CardType.Holding,
                    controller: Players.Self,
                    location: Location.UnderneathStronghold,
                    cardCondition: (card: DrawCard, context) => !!context?.player.stronghold && context.player.stronghold.childCards.includes(card)
                },
                second: {
                    activePromptTitle: 'Choose an unbroken province',
                    dependsOn: 'first',
                    optional: false,
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    controller: Players.Self,
                    cardCondition: (card) => card.location !== Location.StrongholdProvince && !card.isBroken
                }
            },
            handler: (context) => {
                let holding = context.targets.first as DrawCard;
                let province = context.targets.second as ProvinceCard;

                let cards = context.player.getDynastyCardsInProvince(province.location);
                if(context.player.stronghold) {
                    context.player.stronghold.removeChildCard(holding, province.location);
                }
                holding.facedown = false;
                cards.forEach((card: any) => {
                    context.player.moveCard(card, Location.DynastyDiscardPile);
                });
            },
            effect: 'discard {1}, replacing {2} with {3}',
            effectArgs: (context) => [
                context.player.getDynastyCardsInProvince((context.targets.second as ProvinceCard).location),
                context.player.getDynastyCardsInProvince((context.targets.second as ProvinceCard).location).length > 1 ? 'them' : 'it',
                context.targets.first as DrawCard
            ]
        });
    }
}
