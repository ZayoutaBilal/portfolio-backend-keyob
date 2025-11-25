-- AlterTable
ALTER TABLE `Experience` MODIFY `description` TEXT NOT NULL,
    MODIFY `technologies` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `KeyValue` MODIFY `value` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Project` MODIFY `description` TEXT NOT NULL,
    MODIFY `technologies` TEXT NOT NULL;
