import { GameModes } from '../../../GameModes.js';
import { CardTypes, TargetModes, Decks, Locations, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
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
                cardCondition: (card) => card.type === CardTypes.Holding,
                targetMode: TargetModes.Unlimited,
                deck: Decks.DynastyDeck,
                selectedCardsHandler: (context, event, cards) => {
                    if(cards.length > 0) {
                        this.game.addMessage('{0} selects {1}', event.player, cards);
                        cards.forEach((card) => {
                            event.player.stronghold.addChildCard(card, Locations.UnderneathStronghold);
                            event.player.moveCard(card, Locations.UnderneathStronghold);
                            card.lastingEffect(() => ({
                                until: {
                                    onCardMoved: (event: any) =>
                                        event.card === card && event.originalLocation === Locations.UnderneathStronghold
                                },
                                match: card,
                                effect: [AbilityDsl.effects.hideWhenFaceUp()]
                            }));
                        });
                    } else {
                        this.game.addMessage('{0} selects no holdings', event.player);
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
                    cardType: CardTypes.Holding,
                    controller: Players.Self,
                    location: Locations.UnderneathStronghold,
                    cardCondition: (card: DrawCard, context) => !!context?.player.stronghold && context.player.stronghold.childCards.includes(card)
                },
                second: {
                    activePromptTitle: 'Choose an unbroken province',
                    dependsOn: 'first',
                    optional: false,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    cardCondition: (card) => card.location !== Locations.StrongholdProvince && !card.isBroken
                }
            },
            handler: (context) => {
                if(!context) {
                    return;
                }
                let holding = context.targets.first as DrawCard;
                let province = context.targets.second as ProvinceCard;

                let cards = context.player.getDynastyCardsInProvince(province.location);
                if(context.player.stronghold) {
                    context.player.stronghold.removeChildCard(holding, province.location);
                }
                holding.facedown = false;
                cards.forEach((card: any) => {
                    context.player.moveCard(card, Locations.DynastyDiscardPile);
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
