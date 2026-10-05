import type BaseCard from '../../BaseCard.js';
import { CardType, EffectName, Location, PlayType } from '../../Constants.js';
import type DrawCard from '../../DrawCard.js';
import { EffectBuilder } from '../EffectBuilder.js';

export function canPlayFromOwn(
    location: Location,
    cards: Array<DrawCard>,
    sourceOfEffect: BaseCard,
    playType = PlayType.PlayFromHand
) {
    return EffectBuilder.player.detached(EffectName.CanPlayFromOwn, {
        apply(player) {
            for(const card of cards) {
                if(card.type === CardType.Event && card.location === location) {
                    for(const reaction of card.reactions) {
                        reaction.registerEvents();
                    }
                }

                if(!card.fromOutOfPlaySource) {
                    card.fromOutOfPlaySource = [];
                }
                card.fromOutOfPlaySource.push(sourceOfEffect);
            }

            return player.addPlayableLocation(playType, player, location, cards);
        },
        unapply(player, _context, location) {
            player.removePlayableLocation(location);
            for(const card of location.cards) {
                card.removeOutOfPlaySource(sourceOfEffect);
            }
        }
    });
}
