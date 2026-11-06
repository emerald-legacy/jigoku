import { AbilityContext } from '../../AbilityContext.js';
import type { Conflict } from '../../Conflict.js';
import type DrawCard from '../../DrawCard.js';
import type Game from '../../Game.js';
import { CovertAbility } from '../../KeywordAbilities/CovertAbility.js';

export function covertContexts(game: Game, conflict: Conflict): AbilityContext<DrawCard, DrawCard>[] {
    return conflict.attackers
        .filter((card: DrawCard) => card.isCovert())
        .map((card: DrawCard) => new AbilityContext<DrawCard, DrawCard>({
            game,
            player: conflict.attackingPlayer,
            source: card,
            ability: new CovertAbility()
        }));
}
