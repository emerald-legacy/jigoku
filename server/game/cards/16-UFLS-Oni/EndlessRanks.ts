import { Players, CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { BaseOni } from './_BaseOni.js';

export default class EndlessRanks extends BaseOni {
    static id = 'endless-ranks';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Put a dynasty character on top of your deck')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .target('target', {
                controller: Players.Self,
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile
            }, AbilityDsl.actions.moveCard((context) => ({
                target: context.target,
                destination: Location.DynastyDeck
            })));
    }
}
