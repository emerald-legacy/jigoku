describe('Keeper of Inner Peace', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['a-fate-worse-than-death'],
                    inPlay: ['matsu-berserker']
                },
                player2: {
                    hand: ['a-legion-of-one'],
                    inPlay: ['keeper-of-inner-peace', 'moto-youth']
                }
            });

            this.afwtd = this.player1.findCardByName('a-fate-worse-than-death');
            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.matsuBerserker.modifyFate(1);

            this.keeperOfInnerPeace = this.player2.findCardByName('keeper-of-inner-peace');
            this.keeperOfInnerPeace.modifyFate(1);
            this.motoYouth = this.player2.findCardByName('moto-youth');
            this.motoYouth.modifyFate(1);
            this.legionOfOne = this.player2.findCardByName('a-legion-of-one');

            this.noMoreActions();
        });

        it('protects fate from rings', function () {
            this.initiateConflict({
                type: 'military',
                ring: 'void',
                attackers: [this.matsuBerserker],
                defenders: []
            });

            this.player2.pass();
            this.player1.pass();
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Choose character to remove fate from');
            this.player1.clickCard(this.keeperOfInnerPeace);

            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.keeperOfInnerPeace);

            expect(this.keeperOfInnerPeace.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Keeper of Inner Peace to place 1 fate on Keeper of Inner Peace'
            );
        });

        it('protects fate from abilities', function () {
            this.initiateConflict({
                type: 'military',
                ring: 'void',
                attackers: [this.matsuBerserker],
                defenders: [this.keeperOfInnerPeace, this.motoYouth]
            });

            this.player2.pass();
            this.player1.clickCard(this.afwtd);
            this.player1.clickCard(this.motoYouth);

            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.keeperOfInnerPeace);

            expect(this.motoYouth.fate).toBe(1);
            expect(this.motoYouth.bowed).toBe(true);
            expect(this.motoYouth.inConflict).toBe(false);
            expect(this.getChatLogs(5)).toContain('player2 uses Keeper of Inner Peace to place 1 fate on Moto Youth');
        });

        it('does not protect fate from framework effects', function () {
            this.advancePhases('fate');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.keeperOfInnerPeace.fate).toBe(0);
        });

        it('does not work on self abilities', function () {
            this.initiateConflict({
                type: 'military',
                ring: 'void',
                attackers: [this.matsuBerserker],
                defenders: [this.motoYouth]
            });

            this.player2.clickCard(this.legionOfOne);
            this.player2.clickCard(this.motoYouth);
            this.player2.clickPrompt('Remove 1 fate to resolve this ability again');
            this.player2.clickCard(this.motoYouth);

            expect(this.player2).not.toHavePrompt('Any reactions to Fate being moved from Moto Youth?');
        });
    });
});

describe('Keeper of Inner Peace own ring effects', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['keeper-of-inner-peace', 'doji-challenger']
                }
            });
            this.keeperOfInnerPeace = this.player1.findCardByName('keeper-of-inner-peace');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.challenger.fate = 1;
        });

        it('reacts to your own ring effect', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [],
                ring: 'void'
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.challenger);
            expect(this.challenger.fate).toBe(0);
            expect(this.player1).toBeAbleToSelect(this.keeperOfInnerPeace);
        });
    });
});
