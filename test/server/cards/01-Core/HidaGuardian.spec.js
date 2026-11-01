describe('Hida Guardian', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hida-guardian', 'valiant-oathkeeper', 'samurai-of-integrity'],
                    dynastyDeck: ['favorable-ground', 'imperial-storehouse']
                },
                player2: {
                    inPlay: ['serene-warrior', 'doji-whisperer'],
                    dynastyDeck: ['artisan-academy']
                }
            });
            this.guardian = this.player1.findCardByName('hida-guardian');
            this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
            this.samurai = this.player1.findCardByName('samurai-of-integrity');
            this.favorableGround = this.player1.placeCardInProvince('favorable-ground', 'province 1');
            this.storehouse = this.player1.placeCardInProvince('imperial-storehouse', 'province 2');
            this.sereneWarrior = this.player2.findCardByName('serene-warrior');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.academy = this.player2.placeCardInProvince('artisan-academy', 'province 1');
            this.noMoreActions();
        });

        it('gives another participating character +2/+2 for each holding you control until the end of the conflict', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.guardian, this.oathkeeper],
                defenders: [this.sereneWarrior]
            });
            this.player2.pass();
            this.player1.clickCard(this.guardian);
            expect(this.player1).toHavePrompt('Hida Guardian');
            this.player1.clickCard(this.oathkeeper);
            expect(this.oathkeeper.militarySkill).toBe(6);
            expect(this.oathkeeper.politicalSkill).toBe(6);
            expect(this.guardian.militarySkill).toBe(1);
            expect(this.getChatLogs(5)).toContain('player1 uses Hida Guardian to give Valiant Oathkeeper +4military/+4political');
        });

        it('can choose any other participating character, but not itself or a character at home', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.guardian, this.oathkeeper],
                defenders: [this.sereneWarrior]
            });
            this.player2.pass();
            this.player1.clickCard(this.guardian);
            expect(this.player1).toHavePrompt('Hida Guardian');
            expect(this.player1).toBeAbleToSelect(this.oathkeeper);
            expect(this.player1).toBeAbleToSelect(this.sereneWarrior);
            expect(this.player1).not.toBeAbleToSelect(this.guardian);
            expect(this.player1).not.toBeAbleToSelect(this.samurai);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });

        it('cannot be used while it is not participating', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.oathkeeper, this.samurai],
                defenders: [this.sereneWarrior]
            });
            this.player2.pass();
            expect(this.oathkeeper.isParticipating()).toBe(true);
            this.player1.clickCard(this.guardian);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.oathkeeper.militarySkill).toBe(2);
            expect(this.samurai.militarySkill).toBe(3);
        });

        it('keeps the bonus fixed when the number of holdings changes later (ruling #52)', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.guardian, this.oathkeeper],
                defenders: [this.sereneWarrior]
            });
            this.player2.pass();
            this.player1.clickCard(this.guardian);
            this.player1.clickCard(this.oathkeeper);
            expect(this.oathkeeper.militarySkill).toBe(6);
            this.player2.pass();
            this.player1.clickCard(this.storehouse);
            expect(this.storehouse.location).toBe('dynasty discard pile');
            expect(this.player1.player.getNumberOfHoldingsInPlay()).toBe(1);
            expect(this.oathkeeper.militarySkill).toBe(6);
            expect(this.oathkeeper.politicalSkill).toBe(6);
        });

        it('keeps the bonus after Hida Guardian leaves the conflict (ruling #53)', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.guardian, this.oathkeeper],
                defenders: [this.sereneWarrior]
            });
            this.player2.pass();
            this.player1.clickCard(this.guardian);
            this.player1.clickCard(this.oathkeeper);
            this.player2.pass();
            this.player1.clickCard(this.favorableGround);
            this.player1.clickCard(this.guardian);
            expect(this.favorableGround.location).toBe('dynasty discard pile');
            expect(this.guardian.isParticipating()).toBe(false);
            expect(this.oathkeeper.militarySkill).toBe(6);
            expect(this.oathkeeper.politicalSkill).toBe(6);
        });
    });
});
