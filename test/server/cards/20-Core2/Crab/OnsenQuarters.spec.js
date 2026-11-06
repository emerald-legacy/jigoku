describe('Onsen Quarter', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-kuwanan'],
                    provinces: ['midnight-revels', 'manicured-garden', 'onsen-quarters'],
                    role: ['keeper-of-fire']
                },
                player2: {
                    inPlay: ['brash-samurai'],
                    provinces: ['fertile-fields', 'pilgrimage']
                }
            });

            this.revels1 = this.player1.findCardByName('midnight-revels', 'province 1');
            this.manicured1 = this.player1.findCardByName('manicured-garden', 'province 2');
            this.onsen = this.player1.findCardByName('onsen-quarters', 'province 3');

            this.fertileFields = this.player2.findCardByName('fertile-fields', 'province 1');
            this.pilgrimage = this.player2.findCardByName('pilgrimage', 'province 2');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');

            this.revels1.facedown = false;
            this.fertileFields.facedown = false;
            this.onsen.facedown = false;

            this.manicured1.facedown = false;
            this.pilgrimage.facedown = false;
            this.game.checkGameState();
        });

        it('should not raise the province strength of enemy provinces', function() {
            const fertileEnemyBaseStr = this.fertileFields.baseStrength;
            const pilgrimageEnemyBaseStr = this.pilgrimage.baseStrength;


            expect(this.fertileFields.strength).toBe(fertileEnemyBaseStr);
            expect(this.pilgrimage.strength).toBe(pilgrimageEnemyBaseStr);
        });

        it('should raise the province strength of your provinces by 1', function() {
            const revelsFriendlyBaseStr = this.revels1.baseStrength;
            const manicuredFriendlyBaseStr = this.manicured1.baseStrength;

            expect(this.revels1.strength).toBe(revelsFriendlyBaseStr + 1);
            expect(this.manicured1.strength).toBe(manicuredFriendlyBaseStr + 1);
        });

        it('should not raise own strength by 1', function() {
            this.onsen.facedown = false;
            this.game.checkGameState();

            const onsenFriendlyBaseStr = this.onsen.baseStrength;

            expect(this.onsen.strength).toBe(onsenFriendlyBaseStr);
        });

        it('should not raise own strength by 1 (verification)', function() {
            this.onsen.facedown = false;
            this.game.checkGameState();

            const onsenFriendlyBaseStr = this.onsen.baseStrength;

            expect(this.onsen.strength).toBe(onsenFriendlyBaseStr);
        });

        it('ring effect when winning', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.kuwanan],
                province: this.onsen,
                type: 'military',
                ring: 'air'
            });

            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.onsen);
            this.player1.clickCard(this.onsen);

            expect(this.player1).toHavePrompt('Fire Ring');
            this.player1.clickCard(this.kuwanan);
            this.player1.clickPrompt('Honor Doji Kuwanan');

            expect(this.getChatLogs(5)).toContain('player1 uses Onsen Quarters to resolve Fire Ring effect');
            expect(this.getChatLogs(5)).toContain('player1 resolves the fire ring, honoring Doji Kuwanan');
        });
    });
});

describe('Onsen Quarters with an Allied role', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-kuwanan'],
                    provinces: ['onsen-quarters'],
                    role: ['allied-with-the-crab']
                },
                player2: {
                    inPlay: ['brash-samurai']
                }
            });
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.onsen = this.player1.findCardByName('onsen-quarters', 'province 1');
            this.onsen.facedown = false;
            this.game.checkGameState(true);
        });

        it('lets the player pick which of the role\'s elements to resolve', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.kuwanan],
                province: this.onsen,
                type: 'military',
                ring: 'void'
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.onsen);
            this.player1.clickCard(this.onsen);
            expect(this.player1).toHavePrompt('Choose a ring effect to resolve');
            for(const ring of ['Air Ring', 'Earth Ring', 'Fire Ring', 'Void Ring', 'Water Ring']) {
                expect(this.player1).toHavePromptButton(ring);
            }
            this.player1.clickPrompt('Fire Ring');
            expect(this.player1).toHavePrompt('Fire Ring');
            this.player1.clickCard(this.kuwanan);
            this.player1.clickPrompt('Honor Doji Kuwanan');
            expect(this.kuwanan.isHonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Onsen Quarters to resolve the ring effect of one of their role\'s elements');
            expect(this.getChatLogs(5)).toContain('player1 chooses to resolve Fire Ring effect');
        });
    });
});
