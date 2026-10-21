import { modifyBothSkills, playerCannot } from '../../../effects.js';
import { taint } from '../../../GameActions/GameActions.js';
import { CardType, Phase, Players, RestrictionType, RestrictionScope, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class KuniJuurou extends DrawCard {
    static id = 'kuni-juurou';

    public override setupCardAbilities() {
        this.controllerCannotPayHonorCostsEffect();

        this.persistentEffect({
            targetController: Players.Any,
            match: (card) => card.type === CardType.Character && (card.isTainted || card.hasTrait(Trait.Shadowlands)),
            effect: modifyBothSkills(-2)
        });

        this.action('Taint a character')
            .condition((context) =>
                !!(context.player.opponent && context.player.hand.length <= context.player.opponent.hand.length))
            .phase(Phase.Conflict)
            .target({
                cardType: CardType.Character
            }, taint())
            .chatText('identify the source of Crab\'s misfortune… it is {0}! {0} is tainted');
    }

    private controllerCannotPayHonorCostsEffect() {
        this.persistentEffect({
            effect: playerCannot({ cannot: RestrictionType.LoseHonor, appliesTo: RestrictionScope.LoseHonorAsCost })
        });
    }
}
