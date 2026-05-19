import DrawCard from '../../drawcard.js';
import { CardTypes, Players, Locations } from '../../Constants.js';

class KnowTheTerrain extends DrawCard {
    static id = 'know-the-terrain';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Switch the attacked province with a facedown province',
            effect: 'switch the attacked province card',
            when: {
                onConflictDeclaredBeforeProvinceReveal: (event, context) => event.conflict.conflictProvince.isFacedown() &&
                    event.conflict.defendingPlayer === context.player &&
                    event.conflict.conflictProvince.location !== Locations.StrongholdProvince
            },
            handler: context => this.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose an unbroken province',
                cardType: CardTypes.Province,
                context: context,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => card.location !== Locations.StrongholdProvince && !card.isBroken && card.isFacedown() && card !== context.event.conflict.conflictProvince,
                onSelect: (player, card) => {
                    let attackedprovince = context.event.conflict.conflictProvince;
                    let chosenProvince = card;
                    let attackedLocation = attackedprovince.location;
                    let chosenLocation = chosenProvince.location;
                    context.player.moveCard(attackedprovince, chosenLocation);
                    context.player.moveCard(chosenProvince, attackedLocation);

                    chosenProvince.inConflict = true;
                    context.event.conflict.conflictProvince.inConflict = false;
                    context.event.conflict.conflictProvince = chosenProvince;
                    return true;
                }
            })
        });
    }
}


export default KnowTheTerrain;
