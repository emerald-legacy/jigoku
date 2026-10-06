import DrawCard from '../../DrawCard.js';
import { cancel, multiple, putIntoProvince, returnToHand } from '../../GameActions/GameActions.js';
import { CardType, Players, Location } from '../../Constants.js';

class MasterOfManyLifetimes extends DrawCard {
    static id = 'master-of-many-lifetimes';

    setupCardAbilities() {
        this.wouldInterrupt('Return a character and attachments')
            .when({
                onCardLeavesPlay: (event, context) => {
                    return (
                        event.card.controller === context.player &&
                        event.card.type === CardType.Character &&
                        event.card.location === Location.PlayArea
                    );
                }
            })
            .target({
                cardType: CardType.Province,
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: (card) => card.facedown
            })
            .gameAction(cancel((context) => ({
                replacementGameAction: multiple([
                    returnToHand({
                        target: context.event.card?.attachments ?? []
                    }),
                    putIntoProvince({
                        target: context.event.card,
                        destination: context.target?.location
                    })
                ])
            })))
            .effect('prevent {1} from leaving play, putting it into {2} instead', (context) => [context.event.card ?? '', context.target?.location ?? '']);
    }
}


export default MasterOfManyLifetimes;
