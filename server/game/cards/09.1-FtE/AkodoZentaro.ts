import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location, Players } from '../../Constants.js';

class AkodoZentaro extends DrawCard {
    static id = 'akodo-zentaro';

    setupCardAbilities() {
        this.action({
            title: 'Take control of holding',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: CardType.Holding,
                controller: Players.Opponent,
                location: Location.Provinces,
                cardCondition: card => card.isInConflictProvince() && !card.isUnique() && card.isFaceup(),
                gameAction: AbilityDsl.actions.ifAble(context => ({
                    ifAbleAction: AbilityDsl.actions.selectCard({
                        cardType: CardType.Province,
                        location: Location.Provinces,
                        controller: Players.Self,
                        cardCondition: (card: BaseCard) => card.location !== Location.StrongholdProvince && !(card as ProvinceCard).isBroken,
                        subActionProperties: (card: ProvinceCard) => ({ destination: card.location, target: context.player.getDynastyCardsInProvince(card.location) }),
                        gameAction: AbilityDsl.actions.multiple([
                            AbilityDsl.actions.moveCard({
                                target: context.target,
                                changePlayer: true
                            }),
                            AbilityDsl.actions.discardCard()
                        ])
                    }),
                    otherwiseAction: AbilityDsl.actions.discardCard({ target: context.target })
                }))
            },
            effect: 'take control of {0} and move it one of their provinces'
        });
    }
}


export default AkodoZentaro;
