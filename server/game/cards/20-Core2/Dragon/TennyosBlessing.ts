import { CardTypes, EventNames, Players, Locations, TargetModes, Decks } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { GameEvent } from '../../../Events/EventPayloads.js';
import type Player from '../../../Player.js';
import { ProvinceCard } from '../../../ProvinceCard.js';

export default class TennyosBlessing extends DrawCard {
    static id = 'tennyo-s-blessing';

    public setupCardAbilities() {
        this.action<ProvinceCard>({
            title: 'Look at your dynasty deck',
            evenDuringDynasty: true,
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.location !== Locations.StrongholdProvince,
                gameAction: AbilityDsl.actions.deckSearch<ProvinceCard>({
                    targetMode: TargetModes.UpTo,
                    numCards: 2,
                    amount: 4,
                    shuffle: true,
                    deck: Decks.DynastyDeck,
                    selectedCardsHandler: (context, event, cards) => {
                        const searchEvent = event as GameEvent<EventNames.OnDeckSearch> & { player: Player };
                        if(cards.length > 0) {
                            const target = context.target;
                            context.game.addMessage(
                                '{0} selects {1} and puts {2} into {3}',
                                searchEvent.player,
                                cards,
                                cards.length > 1 ? 'them' : 'it',
                                target?.facedown ? target.location : (target ?? '')
                            );
                            cards.forEach((card) => {
                                if(target) {
                                    searchEvent.player.moveCard(card, target.location);
                                }
                                card.facedown = false;
                            });
                        } else {
                            context.game.addMessage('{0} selects no cards', searchEvent.player);
                        }
                    }
                })
            }
        });
    }
}
