import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { Location, CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictsDeclaredThisRound } from '../../ConflictsDeclaredThisRound.js';


export default class SongOfTheEmptyCity extends DrawCard {
    static id = 'song-of-the-empty-city';

    public setupCardAbilities() {
        const declaredConflicts = new ConflictsDeclaredThisRound(this.game);

        this.action('Move holding to another province')
            .target('target', {
                location: Location.Provinces,
                cardType: CardType.Province,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.location !== context.source.location && card.location !== Location.StrongholdProvince
            })
            .gameAction(AbilityDsl.actions.moveCard((context) => ({
                target: context.source,
                destination: context.target.location
            })))
            .then((context) => ({
                thenCondition: () => this.otherHoldingsInSameProvince(context).length > 0,
                gameAction: AbilityDsl.actions.discardCard(() => ({
                    target: this.otherHoldingsInSameProvince(context)
                })),
                message: '{1} discards the other holdings in the province'
            }));

        this.reaction('Gain honor')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.player.getProvinceCardInProvince(context.source.location)
            })
            .gameAction(AbilityDsl.actions.gainHonor(context => ({
                target: context.player,
                amount: declaredConflicts.countAgainst(context.player.getProvinceCardInProvince(context.source.location))
            })))
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }

    private otherHoldingsInSameProvince(context: AbilityContext<this>): BaseCard[] {
        return context.game.allCards.filter(
            (card) =>
                card.location === context.source.location &&
                card.controller === context.source.controller &&
                card.type === CardType.Holding &&
                !card.facedown &&
                card !== context.source
        );
    }
}
