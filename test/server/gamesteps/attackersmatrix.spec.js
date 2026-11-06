import { AttackersMatrix } from '../../../build/server/game/gamesteps/conflict/AttackersMatrix.js';
import { ConflictType } from '../../../build/server/game/Constants.js';

describe('AttackersMatrix', function () {
    beforeEach(function () {
        const ringNames = ['air', 'earth', 'fire', 'void', 'water'];
        this.rings = Object.fromEntries(ringNames.map((name) => [name, { name }]));
        this.openProvince = { uuid: 'open', canDeclare: () => true };
        this.guardedProvince = { uuid: 'guarded', canDeclare: () => true };
        this.characters = ['first', 'second'].map((name) => ({
            name,
            getEffects: () => [],
            canDeclareAsAttacker: (type, ring, province) => province === this.openProvince
        }));
        this.player = {
            opponent: { getProvinces: () => [this.openProvince, this.guardedProvince] },
            hasLegalConflictDeclaration: () => true,
            getEffects: () => []
        };
        this.matrix = new AttackersMatrix(this.player, this.characters, { rings: this.rings });
    });

    describe('isCombinationValid()', function () {
        it('judges the attackers of the chosen province', function () {
            this.matrix.requiredNumberOfAttackers = 2;
            expect(this.matrix.isCombinationValid(this.rings.air, ConflictType.Military, this.openProvince)).toBe(true);
        });

        it('refuses a province that nobody can attack', function () {
            this.matrix.requiredNumberOfAttackers = 2;
            expect(this.matrix.isCombinationValid(this.rings.air, ConflictType.Military, this.guardedProvince)).toBe(false);
        });

        it('accepts a combination when any province allows it', function () {
            this.matrix.requiredNumberOfAttackers = 2;
            expect(this.matrix.isCombinationValid(this.rings.air, ConflictType.Military)).toBe(true);
        });
    });
});
